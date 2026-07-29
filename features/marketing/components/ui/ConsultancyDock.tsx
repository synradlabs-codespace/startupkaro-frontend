"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";

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
        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-40 flex animate-[consultancyDockIn_520ms_cubic-bezier(0.16,1,0.3,1)_both] justify-start pl-4 pr-20 sm:bottom-5 sm:justify-center sm:px-4">
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
            <div className="group relative flex w-full max-w-[520px] items-center gap-2 rounded-xl border border-primary-soft/80 bg-canvas/92 p-2 pr-1.5 shadow-[0_20px_60px_rgba(41,110,249,0.16)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 sm:w-auto sm:min-w-[470px] sm:gap-3 sm:rounded-2xl sm:p-2.5 sm:pr-2">
                <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(110deg,rgba(201,224,252,0.58),transparent_42%,rgba(255,255,255,0.78))] opacity-80" />
                <div className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-brand text-white shadow-[0_10px_24px_rgba(41,110,249,0.22)] sm:flex">
                    <MessageCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 px-2 py-1 sm:px-0 sm:py-0">
                    <p className="relative text-sm font-semibold leading-tight text-ink">Need to Talk Strategy?</p>
                    <p className="relative mt-0.5 truncate text-xs leading-relaxed text-graphite sm:hidden">1:1 expert consult - Rs. 399</p>
                    <p className="relative mt-0.5 hidden truncate text-xs leading-relaxed text-graphite sm:block">Private 1:1 expert consultation at Rs. 399</p>
                </div>
                <Link
                    href="/services/professional-consulting-service"
                    className="relative hidden h-9 shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-brand px-4 text-xs font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep sm:inline-flex"
                >
                    Book
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
