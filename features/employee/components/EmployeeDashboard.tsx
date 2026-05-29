"use client";

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge } from "@/components/custom/StatusBadge";
import { useEmployeeDashboard } from "@/features/employee/hooks/useEmployeeDashboard";
import { formatDate } from "@/features/admin/lib/format";
import { formatINR } from "@/lib/currency";
import { ShoppingCart, Users, MessageSquare, ArrowRight, TrendingUp, Clock } from "lucide-react";

export function EmployeeDashboard() {
    const { isLoading, counts, recentOrders, recentInquiries } = useEmployeeDashboard();

    const activeOrders = recentOrders.filter(
        (o) => o.status === "pending" || o.status === "in_progress" || o.status === "confirmed"
    );

    const stats = [
        {
            label: "Total Orders",
            value: counts.orders,
            icon: ShoppingCart,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: `${activeOrders.length} need attention`,
        },
        {
            label: "Customers",
            value: counts.customers,
            icon: Users,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: "Registered accounts",
        },
        {
            label: "Open Inquiries",
            value: counts.inquiries,
            icon: MessageSquare,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: "Awaiting response",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Welcome back" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Banner ───────────────────────────── */}
                <div className="rounded-xl bg-primary-brand p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-white">Employee Portal</h2>
                            <p className="text-sm text-white/80 mt-0.5">
                                {isLoading
                                    ? "Loading..."
                                    : `${activeOrders.length} active order${activeOrders.length !== 1 ? "s" : ""} · ${counts.inquiries} open inquiries`}
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-white text-primary-deep rounded-lg">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Active
                        </div>
                    </div>
                </div>

                {/* ── Stats ─────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-lg border border-hairline bg-canvas p-5">
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs text-steel font-medium">{stat.label}</p>
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.accent}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-display font-medium text-ink">
                                {isLoading ? "—" : stat.value}
                            </p>
                            <p className="text-xs text-stone mt-1">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Recent Orders ────────────────────────── */}
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
                        <div>
                            <p className="text-sm font-semibold text-charcoal">Recent Orders</p>
                            <p className="text-xs text-stone">Latest orders to action</p>
                        </div>
                        <Link href="/employee/orders" className="inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:underline">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-hairline">
                        {isLoading ? (
                            <div className="px-6 py-8 text-sm text-slate text-center">Loading orders…</div>
                        ) : recentOrders.length === 0 ? (
                            <div className="px-6 py-8 text-sm text-slate text-center">No orders yet</div>
                        ) : (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/employee/orders/${order.id}`}
                                    className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">{order.customer.name}</p>
                                        <p className="text-xs text-stone flex items-center gap-1 mt-0.5">
                                            <Clock className="h-3 w-3" /> {order.service.name} · {formatINR(order.amount)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <OrderStatusBadge status={order.status} />
                                        <span className="text-xs text-slate">{formatDate(order.createdAt)}</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Open Inquiries ───────────────────────── */}
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
                        <div>
                            <p className="text-sm font-semibold text-charcoal">Open Inquiries</p>
                            <p className="text-xs text-stone">Leads awaiting response</p>
                        </div>
                        <Link href="/employee/inquiries" className="inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:underline">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-hairline">
                        {isLoading ? (
                            <div className="px-6 py-8 text-sm text-slate text-center">Loading inquiries…</div>
                        ) : recentInquiries.length === 0 ? (
                            <div className="px-6 py-8 text-sm text-slate text-center">No inquiries yet</div>
                        ) : (
                            recentInquiries.map((inq) => (
                                <Link
                                    key={inq.id}
                                    href={`/employee/inquiries/${inq.id}`}
                                    className="flex items-start justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-charcoal">{inq.name}</p>
                                        <p className="text-xs text-stone truncate mt-0.5">{inq.subject || inq.message}</p>
                                    </div>
                                    <p className="text-xs text-stone shrink-0">{formatDate(inq.createdAt)}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
