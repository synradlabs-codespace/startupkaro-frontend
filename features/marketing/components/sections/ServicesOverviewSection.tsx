// features/marketing/components/sections/ServicesOverviewSection.tsx

import Link from "next/link";
import { ArrowRight, FileText, Building2, Scale, FileCheck } from "lucide-react";

const categories = [
    {
        icon: FileText,
        label: "Tax",
        description: "GST registration, income tax filing, and tax compliance services.",
        color: "text-[#FF9933]",
        bg: "bg-[#FF9933]/8",
        border: "border-[#FF9933]/20",
        href: "/services?category=Tax",
    },
    {
        icon: Building2,
        label: "Business",
        description: "Company incorporation, LLP formation, and startup setup services.",
        color: "text-[#000080]",
        bg: "bg-[#000080]/8",
        border: "border-[#000080]/15",
        href: "/services?category=Business",
    },
    {
        icon: Scale,
        label: "Legal",
        description: "Trademark filing, legal agreements, and IP protection services.",
        color: "text-[#000080]",
        bg: "bg-[#000080]/5",
        border: "border-[#000080]/10",
        href: "/services?category=Legal",
    },
    {
        icon: FileCheck,
        label: "License",
        description: "FSSAI, IEC, shop act, and other business licence services.",
        color: "text-[#6BAE3A]",
        bg: "bg-[#6BAE3A]/8",
        border: "border-[#6BAE3A]/20",
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
                        <p className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-2">What we offer</p>
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">
                            Services for every stage
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FF9933] hover:text-[#FF9933]/80 transition-colors shrink-0"
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
                                className={`group rounded-2xl border ${cat.border} ${cat.bg} p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                            >
                                <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm`}>
                                    <Icon className={`h-5 w-5 ${cat.color}`} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{cat.label}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
                                <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
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
