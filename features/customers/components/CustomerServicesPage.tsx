"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/custom/PageHeader";
import { ServiceCard } from "@/components/custom/ServiceCard";
import { ServiceSearchBar } from "@/components/custom/ServiceSearchBar";
import { TablePagination } from "@/components/custom/TablePagination";
import { SERVICE_CATEGORIES, categoryPillStyles, type ServiceCategory } from "@/lib/category-pills";
import { type EnrichedService } from "@/features/services/lib/merge";
import { useAddCartItem } from "@/features/customers/hooks/useCustomerCart";

const PAGE_SIZE = 50;

type CustomerServiceFilter = ServiceCategory | "Bundles";

const CUSTOMER_SERVICE_FILTERS: CustomerServiceFilter[] = [...SERVICE_CATEGORIES, "Bundles"];

const bundleFilterStyles = {
    idle: "border-orange-200 bg-orange-100 text-orange-700 hover:border-orange-400",
    active: "border-orange-600 bg-orange-600 text-white",
};

interface CustomerServicesPageProps {
    services: EnrichedService[];
}

export function CustomerServicesPage({ services }: CustomerServicesPageProps) {
    const addCartItem = useAddCartItem();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<CustomerServiceFilter>("All");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const filtered = useMemo(() => {
        let result = services;
        if (activeCategory === "Bundles") {
            result = result.filter((s) => s.isBundle);
        } else if (activeCategory !== "All") {
            result = result.filter((s) => s.stage === activeCategory);
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
    const isFiltering = search.trim() !== "" || activeCategory !== "All";

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategory = (category: CustomerServiceFilter) => {
        setActiveCategory(category);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setActiveCategory("All");
        setPage(1);
    };

    return (
        <div className="flex flex-col">
            <PageHeader title="Services" description="Browse startup compliance and legal services" />

            <div className="flex-1 space-y-6 p-6">
                <div className="sticky top-16 z-20 -mx-6 space-y-3 border-b border-hairline bg-canvas/95 px-6 py-4 backdrop-blur-md">
                    <ServiceSearchBar value={search} onChange={handleSearch} />
                    <div className="flex flex-wrap gap-2">
                        {CUSTOMER_SERVICE_FILTERS.map((cat) => {
                            const styles = cat === "Bundles" ? bundleFilterStyles : categoryPillStyles[cat];
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

                {isFiltering && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-charcoal">
                            {total} {total === 1 ? "result" : "results"}
                            {search.trim() && <> for &ldquo;<span className="font-medium text-ink">{search.trim()}</span>&rdquo;</>}
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm font-medium text-primary-brand hover:text-primary-deep"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {paged.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-hairline bg-surface">
                            <Search className="h-5 w-5 text-stone" />
                        </div>
                        <p className="text-base text-ink">No services found</p>
                        <p className="text-xs uppercase tracking-[0.28px] text-graphite">Try a different search or stage</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {paged.map((service) => (
                                <ServiceCard
                                    key={service.slug}
                                    name={service.name}
                                    description={service.cardContent?.shortDescription ?? service.description}
                                    category={service.stage}
                                    price={service.pricePaise ?? 0}
                                    priceInPaise
                                    priceLabel={service.priceLabel}
                                    duration={service.duration ?? "Expert assisted"}
                                    href={`/customer/services/${service.slug}`}
                                    isBundle={service.isBundle}
                                    actionLabel={service.cta === "quote" ? "Quote" : "View"}
                                    footerAction={service.cta === "buy" ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded-md px-3 text-xs uppercase tracking-wide"
                                            onClick={() => addCartItem.mutate({ serviceId: service.id ?? service.slug, quantity: 1 })}
                                            disabled={addCartItem.isPending}
                                        >
                                            Add
                                        </Button>
                                    ) : null}
                                />
                            ))}
                        </div>
                        <div className="overflow-hidden rounded-lg border border-hairline bg-canvas">
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
