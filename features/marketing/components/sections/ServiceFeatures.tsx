// features/marketing/components/sections/ServiceFeatures.tsx

import { CheckCircle2 } from "lucide-react";
import type { Service } from "@/features/marketing/data/types";

export function ServiceFeatures({ service }: { service: Service }) {
    return (
        <section className="py-10 border-b border-hairline">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-display font-normal tracking-tight text-ink mb-6">What's included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                    {service.features.map((feature) => (
                        <div key={feature.title} className="flex items-start gap-3 rounded-lg bg-soft-stone border border-hairline p-4">
                            <div className="h-6 w-6 rounded-full bg-coral/10 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-coral" />
                            </div>
                            <div>
                                <p className="font-sans text-base text-ink">{feature.title}</p>
                                {feature.description && (
                                    <p className="font-sans text-base text-body-muted mt-0.5 leading-relaxed">{feature.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
