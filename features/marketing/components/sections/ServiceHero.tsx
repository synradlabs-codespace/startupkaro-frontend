// features/marketing/components/sections/ServiceHero.tsx

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { Service } from "@/features/marketing/data/types";

export function ServiceHero({ service }: { service: Service }) {
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50/60 via-white to-amber-50/30 border-b border-gray-100">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#FF9933]/8 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-18">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="flex-1">
                        {/* Category badge */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${meta.badge}`}>
                            <Icon className="h-3 w-3" />
                            {service.category}
                        </div>

                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-gray-900 leading-tight mb-3">
                            {service.name}
                        </h1>
                        <p className="text-lg text-gray-500 mb-6 max-w-xl">{service.tagline}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-[#FF9933]" />
                                Delivered in {service.duration}
                            </span>
                        </div>
                    </div>

                    {/* CTA card */}
                    <div className="shrink-0 rounded-2xl border border-[#FF9933]/20 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden w-full md:w-64">
                        <div className="h-1.5 bg-gradient-to-r from-[#FF9933] to-orange-300" />
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Starting at</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{service.pricing.amount.toLocaleString("en-IN")}
                                </p>
                                {service.pricing.note && (
                                    <p className="text-xs text-gray-400 mt-1">{service.pricing.note}</p>
                                )}
                            </div>
                            <Link
                                href={`/customer/checkout?service=${service.slug}`}
                                className="flex items-center justify-center gap-2 w-full h-10 px-4 text-sm font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors"
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <p className="text-[11px] text-center text-gray-400">No hidden fees. Expert assistance included.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
