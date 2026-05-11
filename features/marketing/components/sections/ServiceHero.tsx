// features/marketing/components/sections/ServiceHero.tsx

import { Clock } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { Service } from "@/features/marketing/data/types";
import { FlowButton } from "@/components/custom/FlowButton";

export function ServiceHero({ service }: { service: Service }) {
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;

    return (
        <section className="relative overflow-hidden bg-white border-b border-hairline">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-18">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="flex-1">
                        {/* Category badge */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs uppercase tracking-[0.28px] mb-4 ${meta.badge}`}>
                            <Icon className="h-3 w-3" />
                            {service.category}
                        </div>

                        <h1 className="font-display text-4xl md:text-6xl font-normal tracking-tight text-ink leading-tight mb-3">
                            {service.name}
                        </h1>
                        <p className="font-sans text-base text-body-muted leading-relaxed mb-6 max-w-xl">{service.tagline}</p>

                        <div className="flex items-center gap-4 font-sans text-base text-body-muted">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-coral" />
                                Delivered in {service.duration}
                            </span>
                        </div>
                    </div>

                    {/* CTA card */}
                    <div className="shrink-0 rounded-lg border border-hairline bg-white overflow-hidden w-full md:w-64">
                        <div className="h-1 bg-coral" />
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="font-mono text-xs uppercase tracking-[0.28px] text-body-muted mb-1">Starting at</p>
                                <p className="text-3xl font-display font-normal tracking-tight text-ink">
                                    ₹{service.pricing.amount.toLocaleString("en-IN")}
                                </p>
                                {service.pricing.note && (
                                    <p className="font-sans text-base text-body-muted leading-relaxed mt-1">{service.pricing.note}</p>
                                )}
                            </div>
                            <FlowButton
                                href={`/customer/checkout?service=${service.slug}`}
                                text="Get Started"
                                colorVariant="saffron"
                                className="w-full justify-center"
                            />
                            <p className="font-mono text-xs text-center text-body-muted">No hidden fees. Expert assistance included.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
