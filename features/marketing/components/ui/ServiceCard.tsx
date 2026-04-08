// features/marketing/components/ui/ServiceCard.tsx

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import type { Service } from "@/features/marketing/data/types";

export function ServiceCard({ service }: { service: Service }) {
    const meta = categoryMeta[service.category] ?? fallbackMeta;
    const Icon = meta.icon;

    return (
        <div className="group relative flex flex-col rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            {/* Top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="flex flex-col flex-1 p-5">
                {/* Icon + category */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`h-10 w-10 rounded-xl ${meta.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${meta.color}`} />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.badge}`}>
                        {service.category}
                    </span>
                </div>

                {/* Name + description */}
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">{service.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{service.description}</p>

                <div className="h-px bg-gray-100 my-4" />

                {/* Price + duration + CTA */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-bold text-gray-900">
                            ₹{service.pricing.amount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                        </p>
                    </div>
                    <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[0.8rem] font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors shrink-0"
                    >
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
