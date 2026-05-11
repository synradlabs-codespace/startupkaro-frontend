// features/marketing/components/sections/ServicePricingCTA.tsx

import { Clock, ShieldCheck } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";
import { FlowButton } from "@/components/custom/FlowButton";

export function ServicePricingCTA({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-hairline bg-soft-stone">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 rounded-lg border border-hairline bg-white">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.28px] text-body-muted mb-1">All-inclusive fee</p>
                        <p className="text-4xl font-display font-normal tracking-tight text-ink">
                            ₹{service.pricing.amount.toLocaleString("en-IN")}
                        </p>
                        {service.pricing.note && (
                            <p className="font-sans text-base text-body-muted leading-relaxed mt-1">{service.pricing.note}</p>
                        )}
                        <p className="font-sans text-base text-body-muted flex items-center gap-1.5 mt-2">
                            <Clock className="h-3.5 w-3.5 text-coral" />
                            Delivered in {service.duration}
                        </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-3">
                        <FlowButton
                            href={`/customer/checkout?service=${service.slug}`}
                            text="Get Started Now"
                            colorVariant="saffron"
                        />
                        <p className="font-mono text-xs text-body-muted flex items-center gap-1.5">
                            <ShieldCheck className="h-3 w-3 text-coral" />
                            Expert CA assigned · Secured payment
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
