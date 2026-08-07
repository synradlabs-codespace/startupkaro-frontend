// features/marketing/components/sections/ServiceHero.tsx

import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { EnrichedService } from "@/features/services/lib/merge";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { formatINR } from "@/lib/currency";

export function ServiceHero({ service }: { service: EnrichedService }) {
    const meta = categoryMeta[service.isBundle ? "Bundles" : service.stage] ?? fallbackMeta;
    const Icon = meta.icon;
    const ctaHref = service.cta === "buy" ? `/customer/services/${service.slug}` : `/contact?service=${service.slug}`;

    return (
        <section className="relative px-4 pt-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-hairline bg-canvas">
                <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
                    <div className="flex min-w-0 flex-col justify-center">
                        {/* Category badge */}
                        {service.stage && (
                            <div className={`mb-4 inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium uppercase tracking-[0.28px] ${meta.badge}`}>
                                <Icon className="h-3 w-3" />
                                {service.isBundle ? "Bundle" : service.stage}
                            </div>
                        )}

                        <h1 className="mb-3 font-display text-4xl font-medium leading-none text-ink md:text-6xl">
                            {service.name}
                        </h1>
                        <p className="mb-5 max-w-2xl text-base leading-relaxed text-charcoal md:text-lg">
                            {service.cardContent?.tagline ?? service.description}
                        </p>
                        <p className="mb-7 max-w-2xl text-sm leading-relaxed text-graphite">{service.description}</p>

                        {service.items.length > 0 && (
                            <div className="mb-6 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
                                {service.items.map((item) => (
                                    <div key={item.id} className="flex items-start gap-2 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-charcoal">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-brand" />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 border-t border-hairline pt-5 text-sm text-graphite">
                            {service.duration && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-primary-brand" />
                                    Delivered in {service.duration}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-primary-brand" />
                                Expert-assisted filing
                            </span>
                        </div>
                    </div>

                    {/* CTA card */}
                    <div className="flex flex-col justify-between rounded-xl border border-hairline bg-cloud p-6 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                        <div className="space-y-4">
                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                                    {service.cta === "buy" ? "Starting at" : "Pricing"}
                                </p>
                                <p className="font-display text-4xl font-medium text-ink">
                                    {service.priceLabel ?? (service.pricePaise != null ? formatINR(service.pricePaise) : "On request")}
                                </p>
                            </div>
                            <FlowButton
                                href={ctaHref}
                                text={service.cta === "buy" ? "Add to Cart" : "Request Quote"}
                                colorVariant="primary"
                                wrapperClassName="w-full"
                                className="h-12 w-full justify-center py-0"
                            />
                            <FlowSecondaryButton
                                href="/contact"
                                text="Talk to an Expert"
                                showIcon={false}
                                wrapperClassName="w-full"
                                className="h-12 w-full justify-center bg-canvas py-0"
                            />
                            <p className="text-center text-xs text-graphite">No hidden service fees. Expert assistance included. Government charges, if applicable, are billed separately.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
