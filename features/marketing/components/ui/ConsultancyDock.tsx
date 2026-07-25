"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, X } from "lucide-react";

const DISMISSED_KEY = "startupkaro-consultancy-dock-dismissed";
const TRIGGER_SECTION_ID = "why-founders-choose-us";

export function ConsultancyDock() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const wasDismissed = sessionStorage.getItem(DISMISSED_KEY) === "true";
        if (wasDismissed) {
            setDismissed(true);
            return;
        }

        const showDock = () => setVisible(true);

        const triggerSection = document.getElementById(TRIGGER_SECTION_ID);
        let observer: IntersectionObserver | null = null;

        if (triggerSection) {
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        showDock();
                        observer?.disconnect();
                    }
                },
                { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
            );
            observer.observe(triggerSection);

            const rect = triggerSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.82 && rect.bottom > 0) {
                showDock();
            }
        }

        const handleExitIntent = (event: MouseEvent) => {
            if (event.clientY <= 8 && window.innerWidth >= 1024) {
                showDock();
            }
        };

        document.addEventListener("mouseleave", handleExitIntent);

        return () => {
            observer?.disconnect();
            document.removeEventListener("mouseleave", handleExitIntent);
        };
    }, []);

    const handleDismiss = () => {
        sessionStorage.setItem(DISMISSED_KEY, "true");
        setDismissed(true);
        setVisible(false);
    };

    if (!visible || dismissed) return null;

    return (
        <div className="fixed inset-x-0 bottom-4 z-40 flex animate-[consultancyDockIn_520ms_cubic-bezier(0.16,1,0.3,1)_both] justify-center px-4 sm:bottom-5">
            <style jsx>{`
                @keyframes consultancyDockIn {
                    from {
                        opacity: 0;
                        transform: translateY(22px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
            <div className="group relative flex w-full max-w-[520px] items-center gap-3 rounded-2xl border border-primary-soft/80 bg-canvas/92 p-2.5 pr-2 shadow-[0_20px_60px_rgba(41,110,249,0.16)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:w-auto sm:min-w-[470px]">
                <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,rgba(201,224,252,0.58),transparent_42%,rgba(255,255,255,0.78))] opacity-80" />
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-brand text-white shadow-[0_10px_24px_rgba(41,110,249,0.22)]">
                    <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="relative text-sm font-semibold leading-tight text-ink">Need a quick founder consult?</p>
                    <p className="relative mt-0.5 truncate text-xs leading-relaxed text-graphite">Private 1:1 guidance at Rs. 399.</p>
                </div>
                <Link
                    href="/services/professional-consulting-service"
                    className="relative hidden h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-brand px-4 text-xs font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep sm:inline-flex"
                >
                    Book Consult
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                    href="/services/professional-consulting-service"
                    className="relative inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-primary-brand px-3 text-xs font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep sm:hidden"
                >
                    Book
                </Link>
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="relative -ml-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-graphite/60 transition-colors hover:bg-canvas/80 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-brand/35"
                    aria-label="Dismiss consultancy prompt"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
