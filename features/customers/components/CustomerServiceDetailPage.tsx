import Link from "next/link";
import { ArrowRight, ArrowLeft, Clock, ShieldCheck, Tag } from "lucide-react";
import { PageHeader } from "@/components/custom/PageHeader";
import { ServiceEditorial } from "@/features/services/components/ServiceEditorial";
import { formatINR } from "@/lib/currency";
import { categoryCardStyles, fallbackCardStyles } from "@/lib/category-pills";
import type { EnrichedService } from "@/features/services/lib/merge";

interface CustomerServiceDetailPageProps {
    service: EnrichedService;
}

export function CustomerServiceDetailPage({ service }: CustomerServiceDetailPageProps) {
    const meta =
        service.category !== "Uncategorized"
            ? (categoryCardStyles[service.category as keyof typeof categoryCardStyles] ?? fallbackCardStyles)
            : fallbackCardStyles;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title={service.name}
                description={service.category !== "Uncategorized" ? service.category : "Service"}
                action={
                    <Link
                        href="/customer/services"
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-steel hover:text-charcoal hover:bg-surface rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                }
            />

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Editorial content */}
                    <div className="md:col-span-2 space-y-5">
                        {service.content ? (
                            <ServiceEditorial content={service.content} />
                        ) : (
                            // Fallback when no Sanity content authored yet
                            <div className="rounded-xl bg-primary-brand p-6">
                                <h2 className="text-lg font-semibold text-white mb-1">{service.name}</h2>
                                <p className="text-sm text-white/80 leading-relaxed">{service.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Price + CTA card */}
                    <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                        <div className="h-1.5 bg-primary-brand" />

                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-xs text-stone uppercase tracking-wide font-medium mb-1">Service Fee</p>
                                <p className="text-3xl font-display font-medium text-ink">
                                    {service.pricePaise != null ? formatINR(service.pricePaise) : "—"}
                                </p>
                                {service.duration && (
                                    <p className="text-xs text-stone flex items-center gap-1 mt-1.5">
                                        <Clock className="h-3 w-3" /> Delivered in {service.duration}
                                    </p>
                                )}
                            </div>

                            <div className="h-px bg-surface" />

                            <div className="space-y-2.5">
                                {service.category !== "Uncategorized" && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-steel flex items-center gap-1.5">
                                            <Tag className="h-3 w-3" /> Category
                                        </span>
                                        <span className={`font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                                            {service.category}
                                        </span>
                                    </div>
                                )}
                                {service.duration && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-steel flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" /> Processing Time
                                        </span>
                                        <span className="font-medium text-charcoal">{service.duration}</span>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-surface" />

                            {service.isPurchasable ? (
                                <Link
                                    href={`/customer/checkout?service=${service.slug}`}
                                    className="flex items-center justify-center gap-2 w-full h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-lg transition-colors"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <p className="text-xs text-center text-slate">This service is not currently available for purchase.</p>
                            )}

                            <p className="text-[11px] text-center text-stone flex items-center justify-center gap-1.5">
                                <ShieldCheck className="h-3 w-3 text-primary-brand" />
                                Secured by Razorpay
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
