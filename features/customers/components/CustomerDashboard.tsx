// features/customers/components/CustomerDashboard.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge } from "@/components/custom/StatusBadge";
import { mockPurchases, mockServices } from "@/lib/mock-data";
import { ShoppingBag, Store, ArrowRight, Sparkles, Clock } from "lucide-react";

export function CustomerDashboard() {
    const recentPurchases = mockPurchases.slice(0, 3);

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Welcome back, Rahul" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Banner ───────────────────────────── */}
                <div className="relative overflow-hidden rounded-lg border border-hairline bg-accent-customer p-6">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-brand/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-accent-customer blur-2xl" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-ink">Hello, Rahul 👋</h2>
                            <p className="text-sm text-steel mt-0.5">
                                You have {mockPurchases.length} active purchase{mockPurchases.length !== 1 ? "s" : ""} · {mockServices.length} services available
                            </p>
                        </div>
                        <Link
                            href="/customer/services"
                            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-lg transition-colors shrink-0"
                        >
                            <Store className="h-3.5 w-3.5" />
                            Browse Services
                        </Link>
                    </div>
                </div>

                {/* ── Stats ─────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-hairline bg-canvas p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs text-steel font-medium">My Purchases</p>
                            <div className="h-8 w-8 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <ShoppingBag className="h-4 w-4 text-charcoal" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-ink">{mockPurchases.length}</p>
                        <p className="text-xs text-stone mt-1">Total services ordered</p>
                    </div>

                    <div className="rounded-lg border border-hairline bg-canvas p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs text-steel font-medium">Services Available</p>
                            <div className="h-8 w-8 rounded-lg bg-tint-peach flex items-center justify-center">
                                <Store className="h-4 w-4 text-charcoal" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-ink">{mockServices.length}</p>
                        <p className="text-xs text-stone mt-1">Compliance &amp; legal services</p>
                    </div>
                </div>

                {/* ── Recent Purchases ─────────────────────── */}
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

                    {recentPurchases.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-stone">No purchases yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-hairline">
                            {recentPurchases.map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">{p.service}</p>
                                        <p className="text-xs text-stone flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> {p.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-charcoal">₹{p.amount.toLocaleString("en-IN")}</span>
                                        <OrderStatusBadge status={p.status} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Browse CTA ───────────────────────────── */}
                <div className="rounded-lg border-2 border-dashed border-hairline-strong bg-primary-brand/4 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary-brand/10 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-charcoal" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-charcoal">Need another service?</p>
                            <p className="text-xs text-steel">Browse our catalogue and get started today.</p>
                        </div>
                    </div>
                    <Link
                        href="/customer/services"
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-lg transition-colors shrink-0"
                    >
                        Browse
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
