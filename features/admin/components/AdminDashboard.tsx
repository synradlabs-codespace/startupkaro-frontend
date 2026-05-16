// features/admin/components/AdminDashboard.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockAnalytics, mockOrders, mockPayments } from "@/lib/mock-data";
import {
    TrendingUp, ShoppingCart, Users, IndianRupee,
    CheckCircle2, CreditCard, BarChart3, ArrowRight,
} from "lucide-react";

// ── Derived metrics ──────────────────────────────────────────────
const avgOrderValue = Math.round(mockAnalytics.totalRevenue / mockAnalytics.totalOrders);
const completedCount = mockOrders.filter((o) => o.status === "completed").length;
const completionRate = Math.round((completedCount / mockOrders.length) * 100);
const totalCollected = mockPayments
    .filter((p) => p.status === "paid" || p.status === "partial")
    .reduce((sum, p) => sum + p.amount, 0);
const collectionRate = Math.round((totalCollected / mockAnalytics.totalRevenue) * 100);

export function AdminDashboard() {
    const stats = [
        {
            label: "Total Revenue",
            value: `₹${mockAnalytics.totalRevenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            accent: "bg-primary-brand text-white",
            sub: `Avg ₹${avgOrderValue.toLocaleString("en-IN")} / order`,
            hero: true,
        },
        {
            label: "Total Orders",
            value: mockAnalytics.totalOrders,
            icon: ShoppingCart,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: `${mockAnalytics.activeOrders} currently active`,
        },
        {
            label: "Customers",
            value: mockAnalytics.totalCustomers,
            icon: Users,
            accent: "bg-tint-sky text-primary-brand",
            sub: "Registered accounts",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            icon: CheckCircle2,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: `${completedCount} of ${mockOrders.length} orders done`,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Welcome back, Admin" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Banner ───────────────────────────── */}
                <div className="rounded-xl bg-primary-brand p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Admin Overview</h2>
                            <p className="text-sm text-white/80 mt-0.5">
                                {collectionRate}% collected · {completionRate}% completion · ₹{avgOrderValue.toLocaleString("en-IN")} avg order
                            </p>
                        </div>
                        <Link
                            href="/admin/analytics"
                            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-white text-primary-deep hover:bg-white/90 rounded-lg transition-colors shrink-0"
                        >
                            <BarChart3 className="h-3.5 w-3.5" />
                            Analytics
                        </Link>
                    </div>
                </div>

                {/* ── Stats Grid ───────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`rounded-lg p-5 ${"hero" in stat && stat.hero ? "bg-ink" : "border border-hairline bg-canvas"}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <p className={`text-xs font-medium ${"hero" in stat && stat.hero ? "text-white/70" : "text-steel"}`}>{stat.label}</p>
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.accent}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className={`text-2xl font-display font-medium ${"hero" in stat && stat.hero ? "text-white" : "text-ink"}`}>{stat.value}</p>
                            <p className={`text-xs mt-1 ${"hero" in stat && stat.hero ? "text-white/60" : "text-stone"}`}>{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Secondary KPIs ───────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            label: "Payment Collection",
                            value: `${collectionRate}%`,
                            sub: `₹${totalCollected.toLocaleString("en-IN")} of ₹${mockAnalytics.totalRevenue.toLocaleString("en-IN")}`,
                            icon: CreditCard,
                            bar: collectionRate,
                            barColor: "bg-primary-brand",
                        },
                        {
                            label: "Order Completion",
                            value: `${completionRate}%`,
                            sub: `${completedCount} completed orders`,
                            icon: CheckCircle2,
                            bar: completionRate,
                            barColor: "bg-primary-brand",
                        },
                        {
                            label: "Active Pipeline",
                            value: `${mockAnalytics.activeOrders}`,
                            sub: "Orders in progress",
                            icon: TrendingUp,
                            bar: Math.round((mockAnalytics.activeOrders / mockOrders.length) * 100),
                            barColor: "bg-primary-brand",
                        },
                    ].map((kpi) => (
                        <div key={kpi.label} className="rounded-lg border border-hairline bg-canvas p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-steel font-medium">{kpi.label}</p>
                                <kpi.icon className="h-4 w-4 text-stone" />
                            </div>
                            <p className="text-xl font-display font-medium text-ink">{kpi.value}</p>
                            <div className="space-y-1">
                                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${kpi.barColor} transition-all`} style={{ width: `${kpi.bar}%` }} />
                                </div>
                                <p className="text-xs text-stone">{kpi.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Recent Orders ────────────────────────── */}
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
                        <div>
                            <p className="text-sm font-semibold text-charcoal">Recent Orders</p>
                            <p className="text-xs text-stone">Latest 5 orders across all customers</p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:underline"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-hairline">
                        {mockOrders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-charcoal">{order.customer}</p>
                                    <p className="text-xs text-stone">{order.service} · {order.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-charcoal">₹{order.amount.toLocaleString("en-IN")}</span>
                                    <OrderStatusBadge status={order.status} />
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
