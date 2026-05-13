// features/marketing/components/sections/ServiceFeatures.tsx

import { CheckCircle2 } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";

export function ServiceFeatures({ service }: { service: Service }) {
    return (
        <section className="bg-canvas py-14 md:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 max-w-2xl">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Inclusions</p>
                    <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">What&apos;s included</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {service.features.map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas p-5 transition-colors duration-200 hover:border-primary-brand">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                                <CheckCircle2 className="h-4 w-4 text-primary-brand" />
                            </div>
                            <div>
                                <p className="text-base font-medium text-ink">{feature.title}</p>
                                {feature.description && (
                                    <p className="mt-1 text-sm leading-relaxed text-charcoal">{feature.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
