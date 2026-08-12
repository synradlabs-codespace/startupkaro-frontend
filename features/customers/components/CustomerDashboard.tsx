"use client";

import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge } from "@/components/custom/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCustomerCart } from "@/features/customers/hooks/useCustomerCart";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { useCustomerPurchaseList } from "@/features/customers/hooks/useCustomerPurchases";
import { useCustomerServiceList } from "@/features/customers/hooks/useCustomerServices";
import { useResumePayment } from "@/features/customers/hooks/useResumePayment";
import { formatCustomerDate, getPurchaseId, getPurchaseServiceName } from "@/features/customers/lib/format";
import { getPurchaseAmountDue, isPaymentResumable } from "@/features/customers/lib/payment";
import { NAV_LINKS } from "@/components/directional-hover-header/header/nav-data";
import { categoryCardStyles, fallbackCardStyles, serviceCategoryIcons, type ServiceVisualCategory } from "@/lib/category-pills";
import { formatINR } from "@/lib/currency";
import { Check, Clock, AlertTriangle, RefreshCw, Rocket, ShoppingCart, Store, ArrowRight } from "lucide-react";

const serviceMenuColumns = NAV_LINKS.find((link) => link.label === "Services")?.menu?.columns ?? [];

function isServiceVisualCategory(heading: string): heading is ServiceVisualCategory {
    return heading === "Bundles" || heading === "Start" || heading === "Manage" || heading === "Protect" || heading === "Tech";
}

function toCustomerServiceHref(href?: string) {
    if (!href) return "/customer/services";

    if (href.startsWith("/services/") || href.startsWith("/bundles/")) {
        const slug = href.split("/").filter(Boolean).at(-1);
        return slug ? `/customer/services/${slug}` : "/customer/services";
    }

    if (href.startsWith("/services") || href.startsWith("/bundles")) {
        return "/customer/services";
    }

    return href;
}

export function CustomerDashboard() {
    const profileQuery = useCustomerProfile();
    const purchasesQuery = useCustomerPurchaseList({ page: 1, limit: 10 });
    const servicesQuery = useCustomerServiceList({ page: 1, limit: 1 });
    const cartQuery = useCustomerCart();
    const { resumePayment, isPending: isResuming } = useResumePayment();
    const profile = profileQuery.data;
    const allPurchases = purchasesQuery.data?.data ?? [];
    const purchases = allPurchases.slice(0, 3);
    const purchasesTotal = purchasesQuery.data?.pagination.total ?? 0;
    const servicesTotal = servicesQuery.data?.pagination.total ?? 0;
    const firstName = profile?.name?.split(" ")[0] ?? "there";

    const pendingPurchases = allPurchases.filter(isPaymentResumable);
    const nextPendingPurchase = pendingPurchases[0];
    const cart = cartQuery.data;
    const cartItemCount = cart?.summary.itemCount ?? 0;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Track purchases, browse services, and get expert support." />

            <div className="flex-1 p-6 space-y-6">
                <div className="relative overflow-hidden rounded-xl border border-hairline bg-[#f4f8ff] px-6 py-3.5 shadow-[0_2px_8px_rgba(26,26,26,0.08)] md:min-h-[240px] md:px-9">
                    <div className="relative z-10 max-w-xl md:max-w-[43%] xl:max-w-xl">
                        <h2 className="flex flex-wrap items-center gap-2 font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
                            <span>Welcome, <span className="text-primary-brand">{firstName}</span></span>
                            <span className="relative inline-flex h-8 w-8">
                                <Image
                                    src="/assets/welcome-wave-emoji.png"
                                    alt=""
                                    fill
                                    sizes="32px"
                                    className="object-contain"
                                />
                            </span>
                        </h2>
                        <p className="mt-4 text-xl font-semibold leading-snug text-ink">What would you like to get done today?</p>
                        <p className="mt-4 text-base leading-relaxed text-charcoal">Everything your business needs, all in one place.</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/customer/services"
                                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
                            >
                                <Store className="h-4 w-4" />
                                Browse Services
                            </Link>
                            <span className="inline-flex h-10 items-center rounded-md border border-hairline bg-canvas px-4 text-sm font-medium text-charcoal">
                                {purchasesTotal} active purchase{purchasesTotal !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {[
                        "right-0 top-0 h-20 w-24 opacity-20",
                        "right-32 top-5 h-14 w-14 opacity-16",
                        "right-56 top-20 h-16 w-16 opacity-14",
                        "right-4 bottom-12 h-[4.5rem] w-[4.5rem] opacity-15",
                        "right-40 bottom-4 h-12 w-12 opacity-12",
                        "right-72 bottom-20 h-10 w-10 opacity-10",
                    ].map((position) => (
                        <div
                            key={position}
                            aria-hidden="true"
                            className={`pointer-events-none absolute z-0 hidden md:block ${position}`}
                            style={{
                                backgroundImage: "radial-gradient(circle, #296ef9 1.15px, transparent 1.15px)",
                                backgroundSize: "13px 13px",
                            }}
                        />
                    ))}

                    <div className="relative z-0 mt-4 h-64 md:absolute md:inset-y-2 md:right-6 md:mt-0 md:h-auto md:w-[56%]">
                        <Image
                            src="/assets/customer-welcome-character.png"
                            alt="StartupKaro expert at laptop"
                            fill
                            priority
                            sizes="(min-width: 768px) 56vw, 90vw"
                            className="object-contain object-bottom"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-hairline bg-canvas shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                    <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-5">
                        {serviceMenuColumns.map((column) => {
                            const visualCategory = isServiceVisualCategory(column.heading) ? column.heading : null;
                            const styles = visualCategory ? categoryCardStyles[visualCategory] : fallbackCardStyles;
                            const Icon = visualCategory ? serviceCategoryIcons[visualCategory] : Rocket;

                            return (
                                <div key={column.heading} className="border-b border-hairline p-5 md:border-r xl:border-b-0">
                                    <Link href={toCustomerServiceHref(column.href)} className="group mb-7 flex items-center gap-3">
                                        <span className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:-translate-y-0.5 ${styles.iconBg}`}>
                                            <Icon className={`h-4.5 w-4.5 ${styles.iconText}`} strokeWidth={2} />
                                        </span>
                                        <span className={`rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors group-hover:border-primary-brand ${styles.badge}`}>
                                            {column.heading}
                                        </span>
                                    </Link>
                                    <div className="space-y-2">
                                        {column.items.map((service) => (
                                            <Link
                                                key={`${column.heading}-${service.label}`}
                                                href={toCustomerServiceHref(service.href ?? column.href)}
                                                className="block rounded-lg border border-transparent p-3 transition-colors hover:border-hairline hover:bg-cloud"
                                            >
                                                <span className="block text-sm font-semibold leading-snug text-ink">{service.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-hairline bg-[#f4f8ff] shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                    <div className="grid items-stretch gap-5 px-5 py-2.5 md:grid-cols-[280px_1fr_auto] lg:px-7">
                        <div className="relative mx-auto min-h-48 w-full max-w-[280px] shrink-0 self-stretch md:mx-0">
                            <Image
                                src="/assets/startupkaro-consultation-expert.png"
                                alt="StartupKaro consultation expert"
                                fill
                                sizes="280px"
                                className="object-contain object-bottom"
                            />
                        </div>
                        <div className="min-w-0 self-center text-center md:text-left">
                            <p className="text-lg font-semibold leading-snug text-ink">Not sure what your business needs?</p>
                            <p className="mt-1 text-sm leading-relaxed text-charcoal">Talk to a StartupKaro expert and get a clear roadmap.</p>
                            <div className="mt-3 grid gap-2 text-sm text-charcoal sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                                {["1:1 Expert Consultation", "CA / CS / Legal / Tech Guidance", "Actionable Business Plan"].map((item) => (
                                    <div key={item} className="flex items-center justify-center gap-2 md:justify-start">
                                        <Check className="h-3.5 w-3.5 shrink-0 text-primary-brand" />
                                        <span className="leading-snug">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center self-center border-hairline md:min-w-48 md:border-l md:pl-7">
                            <p className="text-sm font-medium text-ink">1:1 Expert Consultation</p>
                            <p className="mt-1 font-display text-3xl font-medium leading-none text-primary-brand">₹399</p>
                            <Link
                                href="/customer/services/professional-consulting-service"
                                className="mt-4 inline-flex h-10 w-full max-w-44 items-center justify-center rounded-md bg-primary-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-deep"
                            >
                                Book Consultation
                            </Link>
                        </div>
                    </div>
                </div>

                {nextPendingPurchase && (
                    <div className="rounded-lg border border-hairline bg-tint-peach p-5">
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 items-start gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-lg bg-error-brand/10 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-error-brand" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-ink">Payment pending on {getPurchaseServiceName(nextPendingPurchase)}</p>
                                    <p className="mt-0.5 text-xs text-steel">
                                        {formatINR(getPurchaseAmountDue(nextPendingPurchase))} due
                                        {pendingPurchases.length > 1 && ` · ${pendingPurchases.length - 1} more purchase${pendingPurchases.length > 2 ? "s" : ""} pending`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center">
                                <Button
                                    type="button"
                                    size="sm"
                                    className="w-full gap-1.5 bg-error-brand text-white hover:bg-error-brand/90 uppercase tracking-wide sm:w-auto"
                                    onClick={() => void resumePayment(nextPendingPurchase)}
                                    disabled={isResuming}
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Retry your payment
                                </Button>
                                {pendingPurchases.length > 1 && (
                                    <Link href="/customer/purchases" className="inline-flex h-8 items-center justify-center text-xs font-medium text-charcoal hover:underline sm:whitespace-nowrap">
                                        View all
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {cartItemCount > 0 && (
                    <div className="rounded-lg border border-hairline bg-tint-sky p-5">
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                    <ShoppingCart className="h-4 w-4 text-primary-brand" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-ink">
                                        {cartItemCount} item{cartItemCount === 1 ? "" : "s"} in your cart
                                    </p>
                                    <p className="mt-0.5 text-xs text-steel">{formatINR(cart?.summary.total ?? 0)} total</p>
                                </div>
                            </div>
                            <Link
                                href="/customer/cart"
                                className="inline-flex h-8 w-full shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-brand px-3 text-sm font-medium text-white hover:bg-primary-brand/90 uppercase tracking-wide sm:w-auto"
                            >
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Checkout your cart
                            </Link>
                        </div>
                    </div>
                )}

                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
                        <div>
                            <p className="text-sm font-semibold text-charcoal">Recent Purchases</p>
                            <p className="text-xs text-stone">Your latest service orders</p>
                        </div>
                        <Link href="/customer/purchases" className="inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:underline">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {purchasesQuery.isLoading ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-stone">Loading purchases...</p>
                        </div>
                    ) : purchasesQuery.isError ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-error-brand">Failed to load purchases.</p>
                        </div>
                    ) : purchases.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-stone">No purchases yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-hairline">
                            {purchases.map((purchase) => (
                                <div key={getPurchaseId(purchase)} className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">{getPurchaseServiceName(purchase)}</p>
                                        <p className="text-xs text-stone flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> {formatCustomerDate(purchase.createdAt ?? purchase.date)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-charcoal">{formatINR(purchase.amount)}</span>
                                        <OrderStatusBadge status={purchase.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
