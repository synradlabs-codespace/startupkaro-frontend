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
                <div className="relative overflow-hidden rounded-2xl border border-[#FF9933]/15 bg-gradient-to-br from-[#FF9933]/8 via-white/80 to-orange-50/60 backdrop-blur-sm p-6">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#FF9933]/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-orange-200/15 blur-2xl" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Hello, Rahul 👋</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                You have {mockPurchases.length} active purchase{mockPurchases.length !== 1 ? "s" : ""} · {mockServices.length} services available
                            </p>
                        </div>
                        <Link
                            href="/customer/services"
                            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors shrink-0"
                        >
                            <Store className="h-3.5 w-3.5" />
                            Browse Services
                        </Link>
                    </div>
                </div>

                {/* ── Stats ─────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs text-gray-500 font-medium">My Purchases</p>
                            <div className="h-8 w-8 rounded-xl bg-[#FF9933]/10 flex items-center justify-center">
                                <ShoppingBag className="h-4 w-4 text-[#FF9933]" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{mockPurchases.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Total services ordered</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-xs text-gray-500 font-medium">Services Available</p>
                            <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center">
                                <Store className="h-4 w-4 text-orange-500" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{mockServices.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Compliance &amp; legal services</p>
                    </div>
                </div>

                {/* ── Recent Purchases ─────────────────────── */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Recent Purchases</p>
                            <p className="text-xs text-gray-400">Your latest service orders</p>
                        </div>
                        <Link href="/customer/purchases" className="inline-flex items-center gap-1 text-xs font-medium text-[#FF9933] hover:underline">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {recentPurchases.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-gray-400">No purchases yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {recentPurchases.map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{p.service}</p>
                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> {p.date}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-gray-800">₹{p.amount.toLocaleString("en-IN")}</span>
                                        <OrderStatusBadge status={p.status as any} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Browse CTA ───────────────────────────── */}
                <div className="rounded-2xl border-2 border-dashed border-[#FF9933]/25 bg-[#FF9933]/4 p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-[#FF9933]/10 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-[#FF9933]" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">Need another service?</p>
                            <p className="text-xs text-gray-500">Browse our catalogue and get started today.</p>
                        </div>
                    </div>
                    <Link
                        href="/customer/services"
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors shrink-0"
                    >
                        Browse
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
