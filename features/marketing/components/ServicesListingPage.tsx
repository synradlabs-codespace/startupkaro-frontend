"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { ServiceCard } from "@/components/custom/ServiceCard";
import { ServiceSearchBar } from "@/components/custom/ServiceSearchBar";
import { SERVICE_CATEGORIES, categoryPillStyles, type ServiceCategory } from "@/lib/category-pills";
import { getBundles, getStandaloneServices, type EnrichedService } from "@/features/services/lib/merge";

const popularServiceNames = [
    "Professional Consulting Service",
    "Private Limited Company",
    "LLP",
    "Partnership",
    "Proprietorship",
    "GST Registration",
    "Startup India DPIIT",
    "FSSAI Registration (Basic)",
];

function getInitialCategory(category?: string): ServiceCategory {
    return SERVICE_CATEGORIES.includes(category as ServiceCategory) ? (category as ServiceCategory) : "All";
}

export function ServicesListingPage({ services, initialCategory }: { services: EnrichedService[]; initialCategory?: string }) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<ServiceCategory>(() => getInitialCategory(initialCategory));

    useEffect(() => {
        setActiveCategory(getInitialCategory(initialCategory));
    }, [initialCategory]);

    const bundles = useMemo(() => getBundles(services), [services]);
    const popularServices = useMemo(() => {
        const serviceMap = new Map(getStandaloneServices(services).map((service) => [service.name, service]));
        return popularServiceNames
            .map((name) => serviceMap.get(name))
            .filter((service): service is EnrichedService => Boolean(service));
    }, [services]);

    const filtered = useMemo(() => {
        return getStandaloneServices(services).filter((s) => {
            const q = search.toLowerCase();
            const matchSearch =
                s.name.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q) ||
                (s.cardContent?.shortDescription ?? "").toLowerCase().includes(q);
            const matchCategory = activeCategory === "All" || s.stage === activeCategory;
            return matchSearch && matchCategory;
        });
    }, [services, search, activeCategory]);

    const isFiltering = search.trim() !== "" || activeCategory !== "All";

    return (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
            <div>
                <h1 className="mb-2 font-display text-4xl font-medium text-ink md:text-6xl">Our Services</h1>
                <p className="text-base leading-relaxed text-charcoal">Startup compliance, legal, and tech services handled end-to-end by CAs, CSs, lawyers, and software engineers.</p>
            </div>

            <div className="sticky top-18 z-30 -mx-4 space-y-3 border-b border-hairline bg-canvas/95 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <ServiceSearchBar value={search} onChange={setSearch} />
                <div className="flex flex-wrap gap-2">
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

            {!isFiltering && bundles.length > 0 && (
                <section className="space-y-4 rounded-2xl border border-hairline bg-cloud p-5 md:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">Bundles</p>
                            <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">Popular startup bundles</h2>
                        </div>
                        <Link href="/bundles" className="text-sm font-medium text-primary-brand hover:text-primary-deep">
                            View all bundles
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
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
                                href={`/bundles/${bundle.slug}`}
                                isBundle
                            />
                        ))}
                    </div>
                </section>
            )}

            {!isFiltering && popularServices.length > 0 && (
                <section className="space-y-4 rounded-2xl border border-primary-soft bg-canvas p-5 shadow-[0_18px_52px_rgba(41,110,249,0.08)] md:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.28px] text-primary-brand">Popular Services</p>
                            <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">Most requested by new founders</h2>
                        </div>
                        <p className="max-w-md text-sm leading-relaxed text-charcoal">
                            Quick-start services founders usually need before launch, filings, banking, licenses, and first customers.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {popularServices.map((service) => (
                            <ServiceCard
                                key={service.slug}
                                name={service.name}
                                description={service.cardContent?.shortDescription ?? service.description}
                                category={service.stage}
                                price={service.pricePaise ?? 0}
                                priceInPaise
                                priceLabel={service.priceLabel}
                                duration={service.duration ?? "Expert assisted"}
                                href={`/services/${service.slug}`}
                                actionLabel={service.cta === "quote" ? "View Details" : "Learn More"}
                            />
                        ))}
                    </div>
                </section>
            )}

            {isFiltering && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-charcoal">
                        {filtered.length} {filtered.length === 1 ? "result" : "results"}
                        {search.trim() && <> for &ldquo;<span className="font-medium text-ink">{search.trim()}</span>&rdquo;</>}
                    </p>
                    <button
                        type="button"
                        onClick={() => { setSearch(""); setActiveCategory("All"); }}
                        className="text-sm font-medium text-primary-brand hover:text-primary-deep"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-hairline bg-surface">
                        <Search className="h-5 w-5 text-stone" />
                    </div>
                    <p className="text-base text-ink">No services found</p>
                    <p className="text-xs uppercase tracking-[0.28px] text-graphite">Try a different search or stage</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((service) => (
                        <ServiceCard
                            key={service.slug}
                            name={service.name}
                            description={service.cardContent?.shortDescription ?? service.description}
                            category={service.stage}
                            price={service.pricePaise ?? 0}
                            priceInPaise
                            priceLabel={service.priceLabel}
                            duration={service.duration ?? "Expert assisted"}
                            href={`/services/${service.slug}`}
                            actionLabel={service.cta === "quote" ? "View Details" : "Learn More"}
                        />
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 pt-2 text-xs text-graphite">
                <Sparkles className="h-3.5 w-3.5 text-charcoal" />
                All services include expert assistance, email-based document coordination, and updates from your assigned expert.
            </div>
        </div>
    );
}
