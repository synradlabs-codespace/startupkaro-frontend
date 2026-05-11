// features/marketing/components/sections/ServiceHero.tsx

import { Clock } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { Service } from "@/features/marketing/data/types";
import { FlowButton } from "@/components/custom/FlowButton";

export function ServiceHero({ service }: { service: Service }) {
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;

    return (
        <section className="relative overflow-hidden bg-tint-cream rounded-2xl">
            <div className="mx-auto max-w-7xl px-8 py-14 md:py-18">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div className="flex-1">
                        {/* Category badge */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium uppercase tracking-[0.28px] mb-4 ${meta.badge}`}>
                            <Icon className="h-3 w-3" />
                            {service.category}
                        </div>

                        <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-ink leading-tight mb-3">
                            {service.name}
                        </h1>
                        <p className="text-base text-slate leading-relaxed mb-6 max-w-xl">{service.tagline}</p>

                        <div className="flex items-center gap-4 text-base text-steel">
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-charcoal" />
                                Delivered in {service.duration}
                            </span>
                        </div>
                    </div>

                    {/* CTA card */}
                    <div className="shrink-0 rounded-xl border border-hairline bg-canvas overflow-hidden w-full md:w-64">
                        <div className="h-1 bg-tint-sky" />
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-1">Starting at</p>
                                <p className="text-3xl font-display font-semibold tracking-tight text-ink">
                                    ₹{service.pricing.amount.toLocaleString("en-IN")}
                                </p>
                                {service.pricing.note && (
                                    <p className="text-sm text-slate leading-relaxed mt-1">{service.pricing.note}</p>
                                )}
                            </div>
                            <FlowButton
                                href={`/customer/checkout?service=${service.slug}`}
                                text="Get Started"
                                colorVariant="navy"
                                className="w-full justify-center"
                            />
                            <p className="text-xs text-center text-stone">No hidden fees. Expert assistance included.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
