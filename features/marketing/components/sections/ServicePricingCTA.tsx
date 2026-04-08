// features/marketing/components/sections/ServicePricingCTA.tsx

import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";

export function ServicePricingCTA({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-gray-100 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 rounded-2xl border border-[#FF9933]/15 bg-white/70 backdrop-blur-sm shadow-sm">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">All-inclusive fee</p>
                        <p className="text-4xl font-bold text-gray-900">
                            ₹{service.pricing.amount.toLocaleString("en-IN")}
                        </p>
                        {service.pricing.note && (
                            <p className="text-xs text-gray-400 mt-1">{service.pricing.note}</p>
                        )}
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                            <Clock className="h-3.5 w-3.5 text-[#FF9933]" />
                            Delivered in {service.duration}
                        </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                        <Link
                            href={`/customer/checkout?service=${service.slug}`}
                            className="inline-flex items-center justify-center gap-2 h-11 px-8 text-sm font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors shadow-sm"
                        >
                            Get Started Now
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
                            <ShieldCheck className="h-3 w-3 text-[#FF9933]" />
                            Expert CA assigned · Secured payment
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
