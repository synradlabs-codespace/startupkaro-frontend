// features/marketing/components/sections/ServicePricingCTA.tsx

import { Clock, ShieldCheck } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";
import { FlowButton } from "@/components/custom/FlowButton";

export function ServicePricingCTA({ service }: { service: Service }) {
    return (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 rounded-2xl border border-ink bg-ink p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-[0.28px] text-white/70">All-inclusive fee</p>
                        <p className="font-display text-4xl font-medium text-white">
                            ₹{service.pricing.amount.toLocaleString("en-IN")}
                        </p>
                        {service.pricing.note && (
                            <p className="mt-1 text-sm leading-relaxed text-white/80">{service.pricing.note}</p>
                        )}
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                            <Clock className="h-3.5 w-3.5 text-white" />
                            Delivered in {service.duration}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                        <FlowButton
                            href={`/customer/checkout?service=${service.slug}`}
                            text="Get Started Now"
                            colorVariant="primary"
                        />
                        <p className="flex items-center gap-1.5 text-xs text-white/70">
                            <ShieldCheck className="h-3 w-3 text-white" />
                            Expert CA assigned · Secured payment
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
