"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL = "https://wa.me/917700003572";

export function WhatsAppButton() {
    const [visible, setVisible] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastDismissed, setToastDismissed] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 200) setVisible(true);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!visible || toastDismissed) return;
        const t = setTimeout(() => setToastOpen(true), 1500);
        return () => clearTimeout(t);
    }, [visible, toastDismissed]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {toastOpen && (
                <div className="flex items-start gap-2 rounded-xl border border-hairline bg-canvas p-3 shadow-[0_4px_20px_rgba(26,26,26,0.12)] max-w-[210px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink leading-snug">Chat with us on WhatsApp</p>
                        <p className="mt-0.5 text-xs text-charcoal leading-snug">We're online. Ask us anything!</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setToastOpen(false); setToastDismissed(true); }}
                        aria-label="Dismiss"
                        className="mt-0.5 shrink-0 text-graphite hover:text-ink transition-colors"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                onClick={() => setToastOpen(false)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-110 active:scale-95"
            >
                <FaWhatsapp className="h-7 w-7 text-white" />
            </a>
        </div>
    );
}
