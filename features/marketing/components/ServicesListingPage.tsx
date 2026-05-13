// features/marketing/components/ServicesListingPage.tsx

"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "./ui/ServiceCard";
import type { Service } from "@/features/marketing/data/types";

const categories = ["All", "Tax", "Business", "Legal", "License"] as const;
type CategoryFilter = (typeof categories)[number];

const categoryPillStyles: Record<CategoryFilter, { idle: string; active: string }> = {
    All: {
        idle: "border-hairline bg-canvas text-charcoal hover:border-ink hover:text-ink",
        active: "border-ink bg-ink text-white",
    },
    Tax: {
        idle: "border-bloom-rose bg-bloom-rose/45 text-bloom-wine hover:border-bloom-deep",
        active: "border-bloom-deep bg-bloom-deep text-white",
    },
    Business: {
        idle: "border-storm-mist bg-storm-mist/35 text-storm-deep hover:border-storm-deep",
        active: "border-storm-deep bg-storm-deep text-white",
    },
    Legal: {
        idle: "border-bloom-coral bg-bloom-coral/15 text-bloom-wine hover:border-bloom-coral",
        active: "border-bloom-coral bg-bloom-coral text-white",
    },
    License: {
        idle: "border-hairline-strong bg-fog text-ink hover:border-ink",
        active: "border-ink bg-ink text-white",
    },
};

export function ServicesListingPage({ services }: { services: Service[] }) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

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
                <h1 className="mb-2 font-display text-4xl font-medium text-ink md:text-6xl">Our Services</h1>
                <p className="text-base leading-relaxed text-charcoal">Startup compliance and legal services, handled end-to-end by expert CAs.</p>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" />
                    <Input
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-lg border-hairline"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => {
                        const styles = categoryPillStyles[cat];
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.28px] transition-all duration-150 ${
                                    activeCategory === cat ? styles.active : styles.idle
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-surface border border-hairline flex items-center justify-center">
                        <Search className="h-5 w-5 text-stone" />
                    </div>
                    <p className="text-base text-ink">No services found</p>
                    <p className="text-xs uppercase tracking-[0.28px] text-graphite">Try a different search or category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((service) => (
                        <ServiceCard key={service.slug} service={service} />
                    ))}
                </div>
            )}

            {/* Footer note */}
            <div className="flex items-center gap-2 pt-2 text-xs text-graphite">
                <Sparkles className="h-3.5 w-3.5 text-charcoal" />
                All services include expert assistance, email-based document coordination, and updates from your assigned expert.
            </div>
        </div>
    );
}
