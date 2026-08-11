"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, ShieldCheck, ShoppingCart, Tag } from "lucide-react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { ServiceEditorial } from "@/features/services/components/ServiceEditorial";
import { RequestQuoteDialog } from "@/features/customers/components/ui/RequestQuoteDialog";
import { useAddCartItem } from "@/features/customers/hooks/useCustomerCart";
import { formatINR } from "@/lib/currency";
import { categoryCardStyles, fallbackCardStyles } from "@/lib/category-pills";
import type { EnrichedService } from "@/features/services/lib/merge";

interface CustomerServiceDetailPageProps {
    service: EnrichedService;
}

export function CustomerServiceDetailPage({ service }: CustomerServiceDetailPageProps) {
    const router = useRouter();
    const addCartItem = useAddCartItem();
    const [quoteOpen, setQuoteOpen] = useState(false);
    const meta = categoryCardStyles[service.stage as keyof typeof categoryCardStyles] ?? fallbackCardStyles;
    const serviceId = service.id ?? service.slug;

    const addToCart = async (goToCart = false) => {
        await addCartItem.mutateAsync({ serviceId, quantity: 1 });
        if (goToCart) router.push("/customer/cart");
    };

    return (
        <div className={`flex min-h-screen flex-col ${service.cta === "buy" ? "pb-20 md:pb-0" : ""}`}>
            <PageHeader
                title={service.name}
                description={service.isBundle ? "Bundle" : service.stage}
                action={
                    <Link
                        href="/customer/services"
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-steel transition-colors hover:bg-surface hover:text-charcoal"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                }
            />

            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
                    <div className="space-y-5 md:col-span-2">
                        {service.content ? (
                            <ServiceEditorial content={service.content} />
                        ) : (
                            <div className="rounded-xl bg-primary-brand p-6">
                                <h2 className="mb-1 text-lg font-semibold text-white">{service.name}</h2>
                                <p className="text-sm leading-relaxed text-white/80">{service.description}</p>
                            </div>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-lg border border-hairline bg-canvas">
                        <div className="h-1.5 bg-primary-brand" />

                        <div className="space-y-5 p-6">
                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-stone">
                                    {service.cta === "buy" ? "Service Fee" : "Pricing"}
                                </p>
                                <p className="font-display text-3xl font-medium text-ink">
                                    {service.priceLabel ?? (service.pricePaise != null ? formatINR(service.pricePaise) : "On request")}
                                </p>
                                {service.duration && (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-stone">
                                        <Clock className="h-3 w-3" /> Delivered in {service.duration}
                                    </p>
                                )}
                            </div>

                            <div className="h-px bg-surface" />

                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1.5 text-steel">
                                        <Tag className="h-3 w-3" /> Stage
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 font-semibold ${meta.badge}`}>
                                        {service.isBundle ? "Bundle" : service.stage}
                                    </span>
                                </div>
                                {service.duration && (
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1.5 text-steel">
                                            <Clock className="h-3 w-3" /> Processing Time
                                        </span>
                                        <span className="font-medium text-charcoal">{service.duration}</span>
                                    </div>
                                )}
                                {service.items.length > 0 && (
                                    <div className="space-y-2 pt-1">
                                        <p className="text-xs font-medium uppercase tracking-[0.28px] text-stone">Included services</p>
                                        <ul className="space-y-1.5">
                                            {service.items.map((item) => (
                                                <li key={item.id} className="text-xs text-charcoal">- {item.label}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-surface" />

                            {service.cta === "buy" ? (
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full rounded-lg uppercase tracking-wide"
                                        onClick={() => void addToCart(false)}
                                        disabled={addCartItem.isPending}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        type="button"
                                        className="w-full gap-2 rounded-lg bg-primary-brand px-4 text-sm font-medium text-white transition-colors hover:bg-primary-brand/90 uppercase tracking-wide"
                                        onClick={() => void addToCart(true)}
                                        disabled={addCartItem.isPending}
                                    >
                                        Buy Now
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setQuoteOpen(true)}
                                    className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary-brand px-4 text-sm font-medium text-white transition-colors hover:bg-primary-brand/90"
                                >
                                    Request Quote
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}

                            {service.cta === "buy" && (
                                <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-stone">
                                    <ShieldCheck className="h-3 w-3 text-primary-brand" />
                                    Secured by Razorpay
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {service.cta === "buy" && (
                <button
                    type="button"
                    onClick={() => void addToCart(false)}
                    disabled={addCartItem.isPending}
                    aria-label="Add to cart"
                    className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1.45rem)] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-brand text-white shadow-[0_4px_16px_rgba(41,110,249,0.35)] transition-transform duration-200 hover:scale-110 active:scale-95 disabled:opacity-60 md:hidden"
                >
                    <ShoppingCart className="h-6 w-6" />
                </button>
            )}

            <RequestQuoteDialog
                open={quoteOpen}
                onOpenChange={setQuoteOpen}
                service={{ id: service.id, name: service.name }}
            />
        </div>
    );
}
