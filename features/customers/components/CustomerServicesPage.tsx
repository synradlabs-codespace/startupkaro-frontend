// features/customers/components/CustomerServicesPage.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockServices } from "@/lib/mock-data";
import {
    Search,
    Clock,
    ArrowRight,
    FileText,
    Building2,
    Scale,
    FileCheck,
    LayoutGrid,
    Sparkles,
} from "lucide-react";

const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    Tax: {
        icon: FileText,
        color: "text-violet-600",
        bg: "bg-violet-50",
        badge: "bg-violet-100 text-violet-700",
    },
    Business: {
        icon: Building2,
        color: "text-blue-600",
        bg: "bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
    },
    Legal: {
        icon: Scale,
        color: "text-rose-600",
        bg: "bg-rose-50",
        badge: "bg-rose-100 text-rose-700",
    },
    License: {
        icon: FileCheck,
        color: "text-teal-600",
        bg: "bg-teal-50",
        badge: "bg-teal-100 text-teal-700",
    },
};

const fallbackMeta = {
    icon: LayoutGrid,
    color: "text-gray-600",
    bg: "bg-gray-100",
    badge: "bg-gray-100 text-gray-600",
};

const categories = ["All", ...Array.from(new Set(mockServices.map((s) => s.category)))];

export function CustomerServicesPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = mockServices.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.category.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory === "All" || s.category === activeCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Services" description="Browse startup compliance and legal services" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Search + Filter row ──────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 rounded-xl border-gray-200 focus-visible:ring-[#FF9933]/30"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 border ${
                                    activeCategory === cat
                                        ? "bg-[#FF9933] text-white border-[#FF9933] shadow-sm"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-[#FF9933]/40 hover:text-[#FF9933]"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Service Grid ─────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">No services found</p>
                        <p className="text-xs text-gray-400">Try a different search or category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((service) => {
                            const meta = categoryMeta[service.category] ?? fallbackMeta;
                            const Icon = meta.icon;

                            return (
                                <div
                                    key={service.id}
                                    className="group relative flex flex-col rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                                >
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
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug">
                                            {service.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 leading-relaxed flex-1">
                                            {service.description}
                                        </p>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-100 my-4" />

                                        {/* Price + duration + CTA */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">
                                                    ₹{service.price.toLocaleString("en-IN")}
                                                </p>
                                                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Clock className="h-3 w-3" />
                                                    {service.duration}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/customer/services/${service.id}`}
                                                className="inline-flex items-center gap-1.5 h-7 px-2.5 text-[0.8rem] font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors shrink-0"
                                            >
                                                Details
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Footer note ──────────────────────────── */}
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF9933]" />
                    All services include expert assistance and end-to-end document handling.
                </div>
            </div>
        </div>
    );
}
