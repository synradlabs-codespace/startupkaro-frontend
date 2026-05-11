// features/marketing/components/sections/ServicesOverviewSection.tsx

import Link from "next/link";
import { ArrowRight, FileText, Building2, Scale, FileCheck } from "lucide-react";

const categories = [
    {
        icon: FileText,
        label: "Tax",
        description: "GST registration, income tax filing, and tax compliance services.",
        color: "text-coral",
        bg: "bg-coral/8",
        border: "border-coral/20",
        href: "/services?category=Tax",
    },
    {
        icon: Building2,
        label: "Business",
        description: "Company incorporation, LLP formation, and startup setup services.",
        color: "text-primary-brand",
        bg: "bg-primary-brand/8",
        border: "border-primary-brand/15",
        href: "/services?category=Business",
    },
    {
        icon: Scale,
        label: "Legal",
        description: "Trademark filing, legal agreements, and IP protection services.",
        color: "text-primary-brand",
        bg: "bg-primary-brand/5",
        border: "border-primary-brand/10",
        href: "/services?category=Legal",
    },
    {
        icon: FileCheck,
        label: "License",
        description: "FSSAI, IEC, shop act, and other business licence services.",
        color: "text-deep-green",
        bg: "bg-deep-green/8",
        border: "border-deep-green/20",
        href: "/services?category=License",
    },
];

export function ServicesOverviewSection() {
    return (
        <section className="bg-white py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-2">What we offer</p>
                        <h2 className="font-display text-4xl md:text-6xl font-normal tracking-tight text-ink">
                            Services for every stage
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-1.5 font-sans text-base text-coral hover:text-coral/80 transition-colors shrink-0"
                    >
                        View all services
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Category grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.label}
                                href={cat.href}
                                className={`group rounded-lg border ${cat.border} ${cat.bg} p-6 hover:-translate-y-0.5 transition-all duration-200`}
                            >
                                <div className={`h-10 w-10 rounded-lg bg-white border border-hairline flex items-center justify-center mb-4`}>
                                    <Icon className={`h-5 w-5 ${cat.color}`} />
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl font-normal tracking-tight text-ink mb-1.5">{cat.label}</h3>
                                <p className="font-sans text-base text-body-muted leading-relaxed">{cat.description}</p>
                                <div className={`mt-4 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.28px] ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
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
