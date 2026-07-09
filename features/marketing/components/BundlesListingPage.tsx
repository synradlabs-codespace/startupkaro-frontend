import { ServiceCard } from "@/components/custom/ServiceCard";
import type { EnrichedService } from "@/features/services/lib/merge";

export function BundlesListingPage({ bundles }: { bundles: EnrichedService[] }) {
    return (
        <main className="bg-canvas">
            <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Startup bundles</p>
                    <h1 className="mb-2 font-display text-4xl font-medium text-ink md:text-6xl">Bundles</h1>
                    <p className="max-w-2xl text-base leading-relaxed text-charcoal">
                        Fixed-price packages that combine the registrations founders commonly need at launch.
                    </p>
                </div>

                {bundles.length === 0 ? (
                    <div className="rounded-xl border border-hairline bg-cloud p-8 text-center">
                        <p className="text-sm text-slate">No bundles are available right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {bundles.map((bundle) => (
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
                )}
            </div>
        </main>
    );
}
