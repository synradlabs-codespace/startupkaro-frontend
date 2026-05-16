// features/marketing/components/sections/ServicesOverviewSection.tsx

import Link from "next/link";
import { ArrowRight, FileText, Building2, Scale, FileCheck } from "lucide-react";
import { FlowSecondaryButton } from "@/components/custom/FlowButton";
import { LetterSwap } from "@/components/fancy/text";
import { categoryCardStyles } from "@/lib/category-pills";

const categories = [
    {
        icon: FileText,
        label: "Tax" as const,
        description: "GST registration, income tax filing, and tax compliance services.",
        href: "/services?category=Tax",
    },
    {
        icon: Building2,
        label: "Business" as const,
        description: "Company incorporation, LLP formation, and startup setup services.",
        href: "/services?category=Business",
    },
    {
        icon: Scale,
        label: "Legal" as const,
        description: "Trademark filing, legal agreements, and IP protection services.",
        href: "/services?category=Legal",
    },
    {
        icon: FileCheck,
        label: "License" as const,
        description: "FSSAI, IEC, shop act, and other business licence services.",
        href: "/services?category=License",
    },
];

export function ServicesOverviewSection() {
    return (
        <section className="bg-canvas py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28px] text-graphite font-medium mb-2">What we offer</p>
                        <h2 className="font-display text-4xl md:text-5xl font-medium text-ink">
                            Services for every stage
                        </h2>
                    </div>
                    <FlowSecondaryButton
                        href="/services"
                        text="View All Services"
                        iconName="arrow-right"
                        wrapperClassName="shrink-0"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const styles = categoryCardStyles[cat.label];
                        return (
                            <Link
                                key={cat.label}
                                href={cat.href}
                                className="group overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-hairline-strong"
                            >
                                <div className={`h-1 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${styles.strip}`} />
                                <div className="p-6">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${styles.iconText}`} />
                                    </div>
                                    <span className={`rounded-md border px-2.5 py-1 text-xs font-medium uppercase tracking-[0.28px] ${styles.badge}`}>
                                        {cat.label}
                                    </span>
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl font-medium mb-1.5 text-ink">{cat.label}</h3>
                                <p className="text-base leading-relaxed text-charcoal">{cat.description}</p>
                                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary-brand opacity-0 transition-opacity group-hover:opacity-100">
                                    <LetterSwap text="Explore" stagger={10} />
                                    <ArrowRight className="h-3 w-3" />
                                </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
