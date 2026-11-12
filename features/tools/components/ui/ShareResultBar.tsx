"use client";

// Share the current calculation: a link that reopens the same inputs, or a
// branded PNG of the result (rendered by app/api/og/tool/[slug]/route.tsx with
// the same engine as the page, so the numbers always match).

import { useEffect, useState } from "react";
import { FlowSecondaryButton } from "@/components/custom/FlowButton";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useToast } from "@/components/providers/ToastProvider";
import { toolCardUrl } from "@/lib/seo/og";
import { trackToolShared, type ShareMethod } from "@/features/tools/lib/track";

interface ShareResultBarProps {
    slug: string;
    toolName: string;
    /** Serialised inputs (no leading "?") */
    query: string;
    /** One-line plain-text summary used in share messages */
    summary: string;
}

// Text actions use the site's FlowSecondaryButton; the social share buttons
// are icon-only (brand logos), so they keep a minimal square outline.
const actionBtn = "px-5";
const iconBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-md border border-hairline-strong bg-canvas text-charcoal transition-colors hover:border-ink hover:text-ink";

export function ShareResultBar({ slug, toolName, query, summary }: ShareResultBarProps) {
    const toast = useToast();
    const [busy, setBusy] = useState<"image" | "image_square" | "native" | null>(null);
    const [canNativeShare, setCanNativeShare] = useState(false);

    useEffect(() => {
        setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    }, []);

    const shareUrl = () => `${window.location.origin}/tools/${slug}?${query}`;
    const message = () => `${summary}. Calculated with the free ${toolName} on StartupKaro:`;
    const fileName = (square: boolean) => `startupkaro-${slug}${square ? "-square" : ""}-${new Date().toLocaleDateString("en-CA")}.png`;

    const fetchImage = async (square: boolean) => {
        const res = await fetch(toolCardUrl(slug, query, square ? "square" : "landscape"));
        if (!res.ok) throw new Error("image");
        return res.blob();
    };

    const done = (method: ShareMethod) => trackToolShared(slug, method);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl());
            toast.success({ title: "Link copied", description: "Anyone who opens it will see this exact calculation." });
            done("link");
        } catch {
            toast.error({ title: "Couldn't copy the link", description: "Copy it from your browser's address bar instead." });
        }
    };

    const downloadImage = async (square: boolean) => {
        setBusy(square ? "image_square" : "image");
        try {
            const blob = await fetchImage(square);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName(square);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 2000);
            done(square ? "image_square" : "image");
        } catch {
            toast.error({ title: "Couldn't create the image", description: "Please try again in a moment." });
        } finally {
            setBusy(null);
        }
    };

    const nativeShare = async () => {
        setBusy("native");
        try {
            const data: ShareData = { title: `${toolName} | StartupKaro`, text: message(), url: shareUrl() };
            try {
                const file = new File([await fetchImage(false)], fileName(false), { type: "image/png" });
                if (navigator.canShare?.({ files: [file] })) data.files = [file];
            } catch {
                // Fall back to sharing just the link.
            }
            await navigator.share(data);
            done("native");
        } catch (error) {
            if ((error as DOMException)?.name !== "AbortError") {
                toast.error({ title: "Sharing isn't available here", description: "Use Copy Link instead." });
            }
        } finally {
            setBusy(null);
        }
    };

    const openIntent = (method: "whatsapp" | "linkedin" | "x") => {
        const url = encodeURIComponent(shareUrl());
        const text = encodeURIComponent(message());
        const href =
            method === "whatsapp"
                ? `https://wa.me/?text=${text}%20${url}`
                : method === "linkedin"
                  ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
                  : `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(href, "_blank", "noopener,noreferrer");
        done(method);
    };

    return (
        <div className="rounded-xl border border-hairline bg-canvas p-4">
            <p className="text-sm font-medium text-ink">Share this calculation</p>
            <p className="mt-0.5 text-xs text-slate">Send it to a friend or your consultant. The link opens with these exact numbers.</p>
            <div className="mt-3 flex flex-wrap gap-2">
                <FlowSecondaryButton text="Copy Link" onClick={copyLink} showIcon={false} className={actionBtn} />
                <FlowSecondaryButton
                    text={busy === "image" ? "Preparing…" : "Download Image"}
                    onClick={() => downloadImage(false)}
                    disabled={busy !== null}
                    showIcon={false}
                    className={actionBtn}
                />
                <FlowSecondaryButton
                    text={busy === "image_square" ? "Preparing…" : "Square Image"}
                    onClick={() => downloadImage(true)}
                    disabled={busy !== null}
                    showIcon={false}
                    className={actionBtn}
                />
                {canNativeShare && (
                    <FlowSecondaryButton
                        text={busy === "native" ? "Preparing…" : "Share"}
                        onClick={nativeShare}
                        disabled={busy !== null}
                        showIcon={false}
                        className={actionBtn}
                    />
                )}
                <div className="flex gap-2">
                    <button type="button" onClick={() => openIntent("whatsapp")} className={iconBtn} aria-label="Share on WhatsApp">
                        <FaWhatsapp className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => openIntent("linkedin")} className={iconBtn} aria-label="Share on LinkedIn">
                        <FaLinkedin className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => openIntent("x")} className={iconBtn} aria-label="Share on X">
                        <FaXTwitter className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
