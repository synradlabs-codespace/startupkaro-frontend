// features/marketing/components/sections/ServiceOverview.tsx

import type { Service } from "@/features/marketing/data/types";

export function ServiceOverview({ service }: { service: Service }) {
    return (
        <section className="py-14 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 border-y border-hairline py-10 md:grid-cols-[240px_minmax(0,1fr)] md:items-start">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Overview</p>
                        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">What this service covers</h2>
                    </div>
                    <p className="max-w-3xl text-base leading-relaxed text-charcoal">{service.overview}</p>
                </div>
            </div>
        </section>
    );
}
