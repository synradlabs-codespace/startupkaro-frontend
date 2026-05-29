"use client";

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge } from "@/components/custom/StatusBadge";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { useCustomerPurchaseList } from "@/features/customers/hooks/useCustomerPurchases";
import { useCustomerServiceList } from "@/features/customers/hooks/useCustomerServices";
import { formatCustomerDate, getPurchaseId, getPurchaseServiceName } from "@/features/customers/lib/format";
import { formatINR } from "@/lib/currency";
import { Mail, Phone, ShoppingBag, Store, ArrowRight, Clock } from "lucide-react";

export function CustomerDashboard() {
    const profileQuery = useCustomerProfile();
    const purchasesQuery = useCustomerPurchaseList({ page: 1, limit: 3 });
    const servicesQuery = useCustomerServiceList({ page: 1, limit: 1 });
    const profile = profileQuery.data;
    const purchases = purchasesQuery.data?.data ?? [];
    const purchasesTotal = purchasesQuery.data?.pagination.total ?? 0;
    const servicesTotal = servicesQuery.data?.pagination.total ?? 0;
    const firstName = profile?.name?.split(" ")[0] ?? "there";

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

                <div className="rounded-lg border border-hairline bg-canvas p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-charcoal">Document sharing happens over email</p>
                            <p className="mt-1 text-xs leading-relaxed text-steel">
                                After you purchase a service, StartupKaro will email you the required checklist from our official email. Your assigned expert will keep you updated by email and call.
                            </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2 text-xs text-stone">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1">
                                <Mail className="h-3 w-3" />
                                Email checklist
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1">
                                <Phone className="h-3 w-3" />
                                Expert call
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-hairline bg-canvas p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs text-steel font-medium">My Purchases</p>
                            <div className="h-8 w-8 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <ShoppingBag className="h-4 w-4 text-primary-brand" />
                            </div>
                        </div>
                        <p className="text-2xl font-display font-medium text-ink">{purchasesQuery.isLoading ? "-" : purchasesTotal}</p>
                        <p className="text-xs text-stone mt-1">Total services ordered</p>
                    </div>

                    <div className="rounded-lg border border-hairline bg-canvas p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs text-steel font-medium">Services Available</p>
                            <div className="h-8 w-8 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <Store className="h-4 w-4 text-primary-brand" />
                            </div>
                        </div>
                        <p className="text-2xl font-display font-medium text-ink">{servicesQuery.isLoading ? "-" : servicesTotal}</p>
                        <p className="text-xs text-stone mt-1">Compliance &amp; legal services</p>
                    </div>
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
