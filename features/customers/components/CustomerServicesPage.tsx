// features/customers/components/CustomerServicesPage.tsx

"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/custom/PageHeader";
import { ServiceCard } from "@/components/custom/ServiceCard";
import { Input } from "@/components/ui/input";
import { mockServices } from "@/lib/mock-data";
import { SERVICE_CATEGORIES, categoryPillStyles, type ServiceCategory } from "@/lib/category-pills";

export function CustomerServicesPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<ServiceCategory>("All");

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
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
                        <Input
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {SERVICE_CATEGORIES.map((cat) => {
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

                {/* ── Service Grid ─────────────────────────── */}
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
                            <ServiceCard
                                key={service.id}
                                name={service.name}
                                description={service.description}
                                category={service.category}
                                price={service.price}
                                duration={service.duration}
                                href={`/customer/services/${service.id}`}
                            />
                        ))}
                    </div>
                )}

                {/* ── Footer note ──────────────────────────── */}
                <div className="flex items-center gap-2 pt-2 text-xs text-graphite">
                    <Sparkles className="h-3.5 w-3.5 text-charcoal" />
                    All services include expert assistance, email-based document coordination, and updates from your assigned expert.
                </div>
            </div>
        </div>
    );
}
