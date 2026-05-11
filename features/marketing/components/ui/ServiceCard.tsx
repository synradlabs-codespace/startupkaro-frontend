// features/marketing/components/ui/ServiceCard.tsx

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { Service } from "@/features/marketing/data/types";

export function ServiceCard({ service }: { service: Service }) {
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;

    return (
        <div className="group relative flex flex-col rounded-lg border border-hairline bg-white hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            {/* Top accent strip */}
            <div className="h-1 w-full bg-coral opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="flex flex-col flex-1 p-5">
                {/* Icon + category */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`h-10 w-10 rounded-lg ${meta.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${meta.color}`} />
                    </div>
                    <span className={`font-mono text-xs uppercase tracking-[0.28px] px-2.5 py-1 rounded-full ${meta.badge}`}>
                        {service.category}
                    </span>
                </div>

                {/* Name + description */}
                <h3 className="font-display text-2xl font-normal tracking-tight text-ink mb-1.5 leading-snug">{service.name}</h3>
                <p className="font-sans text-base text-body-muted leading-relaxed flex-1">{service.description}</p>

                <div className="h-px bg-hairline my-4" />

                {/* Price + duration + CTA */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-display font-normal tracking-tight text-ink">
                            ₹{service.pricing.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="font-mono text-xs uppercase tracking-[0.28px] text-body-muted flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                        </p>
                    </div>
                    <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 h-7 px-2.5 font-mono text-xs uppercase tracking-[0.28px] bg-coral text-white hover:bg-coral/90 rounded-lg transition-colors shrink-0"
                    >
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
