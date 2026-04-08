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
            accent: "bg-[#138808]/10 text-[#138808]",
            sub: `Avg ₹${avgOrderValue.toLocaleString("en-IN")} / order`,
        },
        {
            label: "Total Orders",
            value: mockAnalytics.totalOrders,
            icon: ShoppingCart,
            accent: "bg-blue-50 text-blue-600",
            sub: `${mockAnalytics.activeOrders} currently active`,
        },
        {
            label: "Customers",
            value: mockAnalytics.totalCustomers,
            icon: Users,
            accent: "bg-violet-50 text-violet-600",
            sub: "Registered accounts",
        },
        {
            label: "Completion Rate",
            value: `${completionRate}%`,
            icon: CheckCircle2,
            accent: "bg-emerald-50 text-emerald-600",
            sub: `${completedCount} of ${mockOrders.length} orders done`,
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Welcome back, Admin" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Banner ───────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl border border-[#138808]/15 bg-gradient-to-br from-[#138808]/8 via-white/80 to-emerald-50/60 backdrop-blur-sm p-6">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#138808]/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-emerald-200/15 blur-2xl" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Admin Overview</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {collectionRate}% collected · {completionRate}% completion · ₹{avgOrderValue.toLocaleString("en-IN")} avg order
                            </p>
                        </div>
                        <Link
                            href="/admin/analytics"
                            className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-[#138808] text-white hover:bg-[#138808]/90 rounded-xl transition-colors shrink-0"
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
                            className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-5"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                                <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${stat.accent}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
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
                            barColor: "bg-[#138808]",
                        },
                        {
                            label: "Order Completion",
                            value: `${completionRate}%`,
                            sub: `${completedCount} completed orders`,
                            icon: CheckCircle2,
                            bar: completionRate,
                            barColor: "bg-emerald-500",
                        },
                        {
                            label: "Active Pipeline",
                            value: `${mockAnalytics.activeOrders}`,
                            sub: "Orders in progress",
                            icon: TrendingUp,
                            bar: Math.round((mockAnalytics.activeOrders / mockOrders.length) * 100),
                            barColor: "bg-blue-500",
                        },
                    ].map((kpi) => (
                        <div key={kpi.label} className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
                                <kpi.icon className="h-4 w-4 text-gray-400" />
                            </div>
                            <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                            <div className="space-y-1">
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${kpi.barColor} transition-all`} style={{ width: `${kpi.bar}%` }} />
                                </div>
                                <p className="text-xs text-gray-400">{kpi.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Recent Orders ────────────────────────── */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Recent Orders</p>
                            <p className="text-xs text-gray-400">Latest 5 orders across all customers</p>
                        </div>
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#138808] hover:underline"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {mockOrders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                                    <p className="text-xs text-gray-400">{order.service} · {order.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-800">₹{order.amount.toLocaleString("en-IN")}</span>
                                    <OrderStatusBadge status={order.status as any} />
                                    <PaymentStatusBadge status={order.paymentStatus as any} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
