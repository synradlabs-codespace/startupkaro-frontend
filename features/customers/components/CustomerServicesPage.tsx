"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/custom/PageHeader";
import { ServiceCard } from "@/components/custom/ServiceCard";
import { TablePagination } from "@/components/custom/TablePagination";
import { Input } from "@/components/ui/input";
import { SERVICE_CATEGORIES, categoryPillStyles, type ServiceCategory } from "@/lib/category-pills";
import { getBundles, type EnrichedService } from "@/features/services/lib/merge";
import { useAddCartItem } from "@/features/customers/hooks/useCustomerCart";

const PAGE_SIZE = 9;

interface CustomerServicesPageProps {
    services: EnrichedService[];
}

export function CustomerServicesPage({ services }: CustomerServicesPageProps) {
    const addCartItem = useAddCartItem();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<ServiceCategory>("All");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const bundles = useMemo(() => getBundles(services), [services]);

    const filtered = useMemo(() => {
        let result = services;
        if (activeCategory !== "All") {
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

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleCategory = (category: ServiceCategory) => {
        setActiveCategory(category);
        setPage(1);
    };

    return (
        <div className="flex min-h-screen flex-col">
            <PageHeader title="Services" description="Browse startup compliance and legal services" />

            <div className="flex-1 space-y-6 p-6">
                {bundles.length > 0 && (
                    <div className="space-y-4 rounded-lg border border-hairline bg-canvas p-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">Bundles</p>
                            <h2 className="font-display text-2xl font-medium text-ink">Startup registration bundles</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {bundles.slice(0, 4).map((bundle) => (
                                <ServiceCard
                                    key={bundle.slug}
                                    name={bundle.name}
                                    description={bundle.cardContent?.shortDescription ?? bundle.description}
                                    category={bundle.stage}
                                    price={bundle.pricePaise ?? 0}
                                    priceInPaise
                                    priceLabel={bundle.priceLabel}
                                    duration={bundle.duration ?? "Expert assisted"}
                                    href={`/customer/services/${bundle.slug}`}
                                    isBundle
                                    actionLabel="View"
                                    footerAction={
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded-md px-3 text-xs uppercase tracking-wide"
                                            onClick={() => addCartItem.mutate({ serviceId: bundle.id ?? bundle.slug, quantity: 1 })}
                                            disabled={addCartItem.isPending}
                                        >
                                            Add
                                        </Button>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
                        <Input
                            placeholder="Search services..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="rounded-lg border-hairline pl-9 focus-visible:ring-primary-brand/20"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
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
