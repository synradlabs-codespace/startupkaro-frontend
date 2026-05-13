// features/marketing/components/ui/ServiceCard.tsx

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { Service } from "@/features/marketing/data/types";

const categoryStyles: Record<Service["category"], { iconBg: string; iconText: string; badge: string; strip: string }> = {
    Tax: {
        iconBg: "bg-bloom-rose/45",
        iconText: "text-bloom-wine",
        badge: "border-bloom-rose bg-bloom-rose/45 text-bloom-wine",
        strip: "bg-bloom-deep",
    },
    Business: {
        iconBg: "bg-storm-mist/35",
        iconText: "text-storm-deep",
        badge: "border-storm-mist bg-storm-mist/35 text-storm-deep",
        strip: "bg-storm-deep",
    },
    Legal: {
        iconBg: "bg-bloom-coral/15",
        iconText: "text-bloom-wine",
        badge: "border-bloom-coral bg-bloom-coral/15 text-bloom-wine",
        strip: "bg-bloom-coral",
    },
    License: {
        iconBg: "bg-fog",
        iconText: "text-ink",
        badge: "border-hairline-strong bg-fog text-ink",
        strip: "bg-ink",
    },
};

export function ServiceCard({ service }: { service: Service }) {
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;
    const styles = categoryStyles[service.category];

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-hairline-strong">
            {/* Top accent strip */}
            <div className={`h-1 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${styles.strip}`} />

            <div className="flex flex-col flex-1 p-5">
                {/* Icon + category */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg}`}>
                        <Icon className={`h-5 w-5 ${styles.iconText}`} />
                    </div>
                    <span className={`rounded-md border px-2.5 py-1 text-xs font-medium uppercase tracking-[0.28px] ${styles.badge}`}>
                        {service.category}
                    </span>
                </div>

                {/* Name + description */}
                <h3 className="mb-1.5 font-display text-xl font-medium leading-snug text-ink">{service.name}</h3>
                <p className="flex-1 text-sm leading-relaxed text-charcoal">{service.description}</p>

                <div className="h-px bg-hairline my-4" />

                {/* Price + duration + CTA */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-display text-2xl font-medium text-ink">
                            ₹{service.pricing.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-graphite">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                        </p>
                    </div>
                    <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary-brand px-3 text-xs font-medium text-white transition-colors hover:bg-primary-deep"
                    >
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
