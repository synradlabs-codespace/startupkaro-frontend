// features/marketing/components/sections/ServiceFAQ.tsx

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";

export function ServiceFAQ({ service }: { service: Service }) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="bg-canvas py-14 md:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Questions</p>
                    <h2 className="mb-6 font-display text-3xl font-medium text-ink md:text-4xl">Frequently asked questions</h2>
                    <div className="space-y-3">
                        {service.faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-hairline bg-canvas overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(open === idx ? null : idx)}
                                    className="flex w-full items-start justify-between gap-4 p-4 text-left"
                                >
                                    <span className="text-base font-medium text-ink">{faq.question}</span>
                                    <ChevronDown
                                        className={`mt-0.5 h-4 w-4 shrink-0 text-graphite transition-transform duration-200 ${open === idx ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {open === idx && (
                                    <div className="px-4 pb-4">
                                        <p className="text-sm leading-relaxed text-charcoal">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
