// features/employee/components/EmployeeDashboard.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockOrders, mockCustomers, mockInquiries } from "@/lib/mock-data";
import { ShoppingCart, Users, MessageSquare, Clock, ArrowRight, TrendingUp } from "lucide-react";

const activeOrders = mockOrders.filter((o) => o.status === "processing" || o.status === "pending");

export function EmployeeDashboard() {
    const stats = [
        {
            label: "Total Orders",
            value: mockOrders.length,
            icon: ShoppingCart,
            accent: "bg-accent-employee text-charcoal",
            sub: `${activeOrders.length} need attention`,
        },
        {
            label: "Customers",
            value: mockCustomers.length,
            icon: Users,
            accent: "bg-tint-lavender text-charcoal",
            sub: "Registered accounts",
        },
        {
            label: "Open Inquiries",
            value: mockInquiries.length,
            icon: MessageSquare,
            accent: "bg-tint-peach text-charcoal",
            sub: "Awaiting response",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Welcome back" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Banner ───────────────────────────── */}
                <div className="relative overflow-hidden rounded-lg border border-hairline bg-accent-employee p-6">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent-employee blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-accent-employee blur-2xl" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-ink">Employee Portal</h2>
                            <p className="text-sm text-steel mt-0.5">
                                {activeOrders.length} active order{activeOrders.length !== 1 ? "s" : ""} · {mockInquiries.length} open inquiries
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-primary-brand text-white rounded-lg">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Active
                        </div>
                    </div>
                </div>

                {/* ── Stats ─────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg border border-hairline bg-canvas p-5"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs text-steel font-medium">{stat.label}</p>
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.accent}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-ink">{stat.value}</p>
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
                        <Link
                            href="/employee/orders"
                            className="inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:underline"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-hairline">
                        {mockOrders.slice(0, 4).map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-charcoal">{order.customer}</p>
                                    <p className="text-xs text-stone flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" /> {order.service}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <OrderStatusBadge status={order.status} />
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Open Inquiries ───────────────────────── */}
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
                        <div>
                            <p className="text-sm font-semibold text-charcoal">Open Inquiries</p>
                            <p className="text-xs text-stone">Leads awaiting response</p>
                        </div>
                        <Link
                            href="/employee/inquiries"
                            className="inline-flex items-center gap-1 text-xs font-medium text-charcoal hover:underline"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-hairline">
                        {mockInquiries.slice(0, 3).map((inq) => (
                            <div key={inq.id} className="flex items-start justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-charcoal">{inq.name}</p>
                                    <p className="text-xs text-stone truncate mt-0.5">{inq.message}</p>
                                </div>
                                <p className="text-xs text-stone shrink-0">{inq.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
