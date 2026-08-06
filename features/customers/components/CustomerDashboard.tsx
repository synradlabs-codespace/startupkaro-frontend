"use client";

import Link from "next/link";
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
import { formatINR } from "@/lib/currency";
import { ShoppingBag, ShoppingCart, Store, ArrowRight, Clock, AlertTriangle, RefreshCw } from "lucide-react";

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
            <PageHeader title="Dashboard" description={`Welcome back, ${firstName}`} />

            <div className="flex-1 p-6 space-y-6">
                <div className="rounded-xl bg-primary-brand p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Hello, {firstName}</h2>
                            <p className="text-sm text-white/80 mt-0.5">
                                You have {purchasesTotal} active purchase{purchasesTotal !== 1 ? "s" : ""} | {servicesTotal} services available
                            </p>
                        </div>
                        <Link
                            href="/customer/services"
                            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-white text-primary-deep hover:bg-white/90 rounded-lg transition-colors shrink-0"
                        >
                            <Store className="h-3.5 w-3.5" />
                            Browse Services
                        </Link>
                    </div>
                </div>

                {nextPendingPurchase && (
                    <div className="rounded-lg border border-hairline bg-tint-peach p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-lg bg-error-brand/10 flex items-center justify-center">
                                    <AlertTriangle className="h-4 w-4 text-error-brand" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-ink">Payment pending on {getPurchaseServiceName(nextPendingPurchase)}</p>
                                    <p className="mt-0.5 text-xs text-steel">
                                        {formatINR(getPurchaseAmountDue(nextPendingPurchase))} due
                                        {pendingPurchases.length > 1 && ` · ${pendingPurchases.length - 1} more purchase${pendingPurchases.length > 2 ? "s" : ""} pending`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    className="gap-1.5 bg-error-brand text-white hover:bg-error-brand/90 uppercase tracking-wide"
                                    onClick={() => void resumePayment(nextPendingPurchase)}
                                    disabled={isResuming}
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Retry your payment
                                </Button>
                                {pendingPurchases.length > 1 && (
                                    <Link href="/customer/purchases" className="text-xs font-medium text-charcoal hover:underline whitespace-nowrap">
                                        View all
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {cartItemCount > 0 && (
                    <div className="rounded-lg border border-hairline bg-tint-sky p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                    <ShoppingCart className="h-4 w-4 text-primary-brand" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-ink">
                                        {cartItemCount} item{cartItemCount === 1 ? "" : "s"} in your cart
                                    </p>
                                    <p className="mt-0.5 text-xs text-steel">{formatINR(cart?.summary.total ?? 0)} total</p>
                                </div>
                            </div>
                            <Link
                                href="/customer/cart"
                                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary-brand px-3 text-sm font-medium text-white hover:bg-primary-brand/90 uppercase tracking-wide"
                            >
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Checkout your cart
                            </Link>
                        </div>
                    </div>
                )}

                <div className="rounded-lg border border-hairline bg-canvas p-5">
                    <div className="flex items-start justify-between mb-3">
                        <p className="text-xs text-steel font-medium">My Purchases</p>
                        <div className="h-8 w-8 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <ShoppingBag className="h-4 w-4 text-primary-brand" />
                        </div>
                    </div>
                    <p className="text-2xl font-display font-medium text-ink">{purchasesQuery.isLoading ? "-" : purchasesTotal}</p>
                    <p className="text-xs text-stone mt-1">Total services ordered</p>
                    <p className="mt-3 border-t border-hairline pt-3 text-xs leading-relaxed text-steel">
                        After you purchase a service, StartupKaro will email you the required checklist from our official email. Your assigned expert will keep you updated by email and call.
                    </p>
                </div>

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
