"use client";

import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArticleShareButtonProps {
    title: string;
    summary: string;
    className?: string;
}

function isMobileViewport() {
    return window.matchMedia("(max-width: 767px)").matches;
}

async function copyToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

export function ArticleShareButton({ title, summary, className }: ArticleShareButtonProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;

        const timeout = window.setTimeout(() => setCopied(false), 1800);
        return () => window.clearTimeout(timeout);
    }, [copied]);

    async function handleShare() {
        const url = window.location.href;
        const shareData: ShareData = {
            title,
            text: summary,
            url,
        };

        if (isMobileViewport() && navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") return;
            }
        }

        await copyToClipboard(url);
        setCopied(true);
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className={cn("shrink-0 cursor-pointer border-hairline-strong text-ink", className)}
            aria-label={copied ? "Article URL copied" : "Share article"}
        >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Share"}
        </Button>
    );
}
