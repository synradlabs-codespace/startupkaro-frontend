// features/marketing/components/sections/ServicesOverviewSection.tsx

import Link from "next/link";
import { ArrowRight, FileText, Building2, Scale, FileCheck } from "lucide-react";

const categories = [
    {
        icon: FileText,
        label: "Tax",
        description: "GST registration, income tax filing, and tax compliance services.",
        bg: "bg-tint-lavender",
        href: "/services?category=Tax",
    },
    {
        icon: Building2,
        label: "Business",
        description: "Company incorporation, LLP formation, and startup setup services.",
        bg: "bg-tint-sky",
        href: "/services?category=Business",
    },
    {
        icon: Scale,
        label: "Legal",
        description: "Trademark filing, legal agreements, and IP protection services.",
        bg: "bg-tint-peach",
        href: "/services?category=Legal",
    },
    {
        icon: FileCheck,
        label: "License",
        description: "FSSAI, IEC, shop act, and other business licence services.",
        bg: "bg-tint-mint",
        href: "/services?category=License",
    },
];

export function ServicesOverviewSection() {
    return (
        <section className="bg-canvas py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-2">What we offer</p>
                        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-ink">
                            Services for every stage
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-1.5 text-base text-ink hover:text-charcoal transition-colors shrink-0"
                    >
                        View all services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.label}
                                href={cat.href}
                                className={`group rounded-xl border border-hairline ${cat.bg} p-6 hover:-translate-y-0.5 transition-all duration-200`}
                            >
                                <div className="h-10 w-10 rounded-lg bg-white/70 border border-hairline flex items-center justify-center mb-4">
                                    <Icon className="h-5 w-5 text-charcoal" />
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-1.5">{cat.label}</h3>
                                <p className="text-base text-slate leading-relaxed">{cat.description}</p>
                                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explore <ArrowRight className="h-3 w-3" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
