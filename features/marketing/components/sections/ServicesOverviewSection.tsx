// features/marketing/components/sections/ServicesOverviewSection.tsx

import Link from "next/link";
import { ArrowRight, LineChart, PackageCheck, Rocket, ShieldCheck } from "lucide-react";
import { FlowSecondaryButton } from "@/components/custom/FlowButton";
import { LetterSwap } from "@/components/fancy/text";
import { categoryCardStyles } from "@/lib/category-pills";

const categories = [
    {
        icon: Rocket,
        label: "Start" as const,
        description: "Incorporation, registrations, licences, and launch-ready setup services.",
        href: "/services?category=Start",
    },
    {
        icon: LineChart,
        label: "Manage" as const,
        description: "Compliance, accounting, tax, finance, and advisory support.",
        href: "/services?category=Manage",
    },
    {
        icon: ShieldCheck,
        label: "Protect" as const,
        description: "Trademark, agreements, notices, and legal protection services.",
        href: "/services?category=Protect",
    },
    {
        icon: PackageCheck,
        label: "Bundles" as const,
        description: "Incorporation and essential business registrations bundled together at attractive prices.",
        href: "/bundles",
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
