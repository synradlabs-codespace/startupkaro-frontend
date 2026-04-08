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
            accent: "bg-[#000080]/8 text-[#000080]",
            sub: `${activeOrders.length} need attention`,
        },
        {
            label: "Customers",
            value: mockCustomers.length,
            icon: Users,
            accent: "bg-violet-50 text-violet-600",
            sub: "Registered accounts",
        },
        {
            label: "Open Inquiries",
            value: mockInquiries.length,
            icon: MessageSquare,
            accent: "bg-orange-50 text-orange-500",
            sub: "Awaiting response",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Dashboard" description="Welcome back" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Banner ───────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl border border-[#000080]/10 bg-gradient-to-br from-[#000080]/6 via-white/80 to-indigo-50/60 backdrop-blur-sm p-6">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#000080]/6 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-indigo-200/15 blur-2xl" />
                    <div className="relative flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Employee Portal</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {activeOrders.length} active order{activeOrders.length !== 1 ? "s" : ""} · {mockInquiries.length} open inquiries
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium bg-[#000080] text-white rounded-xl">
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

                {/* ── Recent Orders ────────────────────────── */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Recent Orders</p>
                            <p className="text-xs text-gray-400">Latest orders to action</p>
                        </div>
                        <Link
                            href="/employee/orders"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#000080] hover:underline"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {mockOrders.slice(0, 4).map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                        <Clock className="h-3 w-3" /> {order.service}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <OrderStatusBadge status={order.status as any} />
                                    <PaymentStatusBadge status={order.paymentStatus as any} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Open Inquiries ───────────────────────── */}
                <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Open Inquiries</p>
                            <p className="text-xs text-gray-400">Leads awaiting response</p>
                        </div>
                        <Link
                            href="/employee/inquiries"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#000080] hover:underline"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {mockInquiries.slice(0, 3).map((inq) => (
                            <div key={inq.id} className="flex items-start justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-800">{inq.name}</p>
                                    <p className="text-xs text-gray-400 truncate mt-0.5">{inq.message}</p>
                                </div>
                                <p className="text-xs text-gray-400 shrink-0">{inq.date}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
