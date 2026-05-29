"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/custom/PageHeader";
import { ServiceCard } from "@/components/custom/ServiceCard";
import { TablePagination } from "@/components/custom/TablePagination";
import { Input } from "@/components/ui/input";
import { SERVICE_CATEGORIES, categoryPillStyles, type ServiceCategory } from "@/lib/category-pills";
import type { EnrichedService } from "@/features/services/lib/merge";

const PAGE_SIZE = 9;

interface CustomerServicesPageProps {
    services: EnrichedService[];
}

export function CustomerServicesPage({ services }: CustomerServicesPageProps) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<ServiceCategory>("All");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const filtered = useMemo(() => {
        let result = services;
        if (activeCategory !== "All") {
            result = result.filter((s) => s.category === activeCategory);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q) ||
                    (s.cardContent?.shortDescription ?? "").toLowerCase().includes(q),
            );
        }
        return result;
    }, [services, activeCategory, search]);

    const total = filtered.length;
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategory = (category: ServiceCategory) => {
        setActiveCategory(category);
        setPage(1);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Services" description="Browse startup compliance and legal services" />

            <div className="flex-1 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
                        <Input
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
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
                                    onClick={() => handleCategory(cat)}
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

                {paged.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-surface border border-hairline flex items-center justify-center">
                            <Search className="h-5 w-5 text-stone" />
                        </div>
                        <p className="text-base text-ink">No services found</p>
                        <p className="text-xs uppercase tracking-[0.28px] text-graphite">Try a different search or category</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {paged.map((service) => (
                                <ServiceCard
                                    key={service.slug}
                                    name={service.name}
                                    description={service.cardContent?.shortDescription ?? service.description}
                                    category={service.category === "Uncategorized" ? "" : service.category}
                                    price={service.pricePaise ?? 0}
                                    priceInPaise
                                    duration={service.duration ?? "—"}
                                    href={`/customer/services/${service.slug}`}
                                />
                            ))}
                        </div>
                        <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                            <TablePagination
                                total={total}
                                page={page}
                                pageSize={pageSize}
                                onPageChange={setPage}
                                onPageSizeChange={setPageSize}
                            />
                        </div>
                    </>
                )}

                <div className="flex items-center gap-2 pt-2 text-xs text-graphite">
                    <Sparkles className="h-3.5 w-3.5 text-charcoal" />
                    All services include expert assistance, email-based document coordination, and updates from your assigned expert.
                </div>
            </div>
        </div>
    );
}
