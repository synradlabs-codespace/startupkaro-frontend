// features/marketing/components/sections/ServiceFAQ.tsx

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";

export function ServiceFAQ({ service }: { service: Service }) {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently asked questions</h2>
                    <div className="space-y-3">
                        {service.faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-xl border border-gray-200/60 bg-white/70 backdrop-blur-sm overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(open === idx ? null : idx)}
                                    className="w-full flex items-start justify-between gap-4 p-4 text-left"
                                >
                                    <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 text-gray-400 shrink-0 mt-0.5 transition-transform duration-200 ${open === idx ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {open === idx && (
                                    <div className="px-4 pb-4">
                                        <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
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
