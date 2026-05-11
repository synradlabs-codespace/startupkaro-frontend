// features/marketing/components/sections/ServiceFeatures.tsx

import { CheckCircle2 } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";

export function ServiceFeatures({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-hairline">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink mb-6">What&apos;s included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                    {service.features.map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3 rounded-xl bg-tint-mint border border-hairline p-4">
                            <div className="h-6 w-6 rounded-full bg-white/60 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-charcoal" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-ink">{feature.title}</p>
                                {feature.description && (
                                    <p className="text-sm text-slate mt-0.5 leading-relaxed">{feature.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
