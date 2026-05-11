// features/marketing/components/ServicesListingPage.tsx

"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "./ui/ServiceCard";
import type { Service } from "@/features/marketing/data/types";

const categories = ["All", "Tax", "Business", "Legal", "License"] as const;

export function ServicesListingPage({ services }: { services: Service[] }) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const filtered = services.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.description.toLowerCase().includes(search.toLowerCase()) ||
            s.category.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory === "All" || s.category === activeCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Page title */}
            <div>
                <h1 className="font-display text-4xl md:text-6xl font-normal tracking-tight text-ink mb-2">Our Services</h1>
                <p className="font-sans text-base text-body-muted leading-relaxed">Startup compliance and legal services, handled end-to-end by expert CAs.</p>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-body-muted" />
                    <Input
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-lg border-hairline focus-visible:ring-coral/30"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-[0.28px] transition-all duration-150 border ${
                                activeCategory === cat
                                    ? "bg-coral text-white border-coral"
                                    : "bg-white text-body-muted border-hairline hover:border-coral/40 hover:text-coral"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-soft-stone border border-hairline flex items-center justify-center">
                        <Search className="h-5 w-5 text-body-muted" />
                    </div>
                    <p className="font-sans text-base text-ink">No services found</p>
                    <p className="font-mono text-xs uppercase tracking-[0.28px] text-body-muted">Try a different search or category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>
            )}

            {/* Footer note */}
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28px] text-body-muted pt-2">
                <Sparkles className="h-3.5 w-3.5 text-coral" />
                All services include expert assistance and end-to-end document handling.
            </div>
        </div>
    );
}
