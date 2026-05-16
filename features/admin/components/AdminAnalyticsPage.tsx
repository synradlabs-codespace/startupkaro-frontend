// features/admin/components/AdminAnalyticsPage.tsx

import { PageHeader } from "@/components/custom/PageHeader";
import { mockAnalytics, mockOrders, mockPayments } from "@/lib/mock-data";
import {
    IndianRupee, TrendingUp, CheckCircle2, CreditCard,
    ShoppingCart, Users, BarChart3, PieChart,
} from "lucide-react";

// ── Derived metrics ──────────────────────────────────────────────
const avgOrderValue = Math.round(mockAnalytics.totalRevenue / mockAnalytics.totalOrders);

const completedCount = mockOrders.filter((o) => o.status === "completed").length;
const completionRate = Math.round((completedCount / mockOrders.length) * 100);

const totalCollected = mockPayments
    .filter((p) => p.status === "paid" || p.status === "partial")
    .reduce((sum, p) => sum + p.amount, 0);
const pendingCollection = mockPayments
    .filter((p) => p.status === "unpaid")
    .reduce((sum, p) => sum + p.amount, 0);
const collectionRate = Math.round((totalCollected / mockAnalytics.totalRevenue) * 100);

const months = mockAnalytics.revenueByMonth;
const maxMonthlyRevenue = Math.max(...months.map((m) => m.revenue));
const momGrowth = Math.round(
    ((months[months.length - 1].revenue - months[months.length - 2].revenue) /
        months[months.length - 2].revenue) *
    100
);

// Revenue by service (grouped from orders)
const revenueByService = Object.entries(
    mockOrders.reduce<Record<string, number>>((acc, o) => {
        acc[o.service] = (acc[o.service] || 0) + o.amount;
        return acc;
    }, {})
).sort((a, b) => b[1] - a[1]);
const maxSvcRevenue = revenueByService[0]?.[1] ?? 1;

// Order status chart — using HP palette hex values
const statusColors: Record<string, string> = {
    Completed: "#296ef9",   // primary-brand
    Processing: "#356373",  // storm-deep
    Pending: "#ff5050",     // bloom-coral
    Cancelled: "#b3262b",   // error / bloom-deep
};
const statusTotal = mockAnalytics.ordersByStatus.reduce((s, r) => s + r.count, 0);
let cumPct = 0;
const donutSegments = mockAnalytics.ordersByStatus.map((row) => {
    const pct = (row.count / statusTotal) * 100;
    const segment = { ...row, pct, start: cumPct, color: statusColors[row.status] ?? "#c2c2c2" };
    cumPct += pct;
    return segment;
});
const donutGradient = `conic-gradient(${donutSegments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`)
    .join(", ")})`;

// Payment breakdown — HP palette hex values
const paymentBreakdown = [
    { label: "Collected", amount: totalCollected, pct: collectionRate, color: "#296ef9" },
    { label: "Pending", amount: pendingCollection, pct: Math.round((pendingCollection / mockAnalytics.totalRevenue) * 100), color: "#ff5050" },
    { label: "Refunded", amount: mockPayments.filter(p => p.status === "refunded").reduce((s, p) => s + p.amount, 0), pct: 0, color: "#b3262b" },
];

export function AdminAnalyticsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Analytics" description="Business performance overview" />

            <div className="flex-1 p-6 space-y-6">

                {/* ── KPI Cards ────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Total Revenue",
                            value: `₹${mockAnalytics.totalRevenue.toLocaleString("en-IN")}`,
                            sub: `+${momGrowth}% vs last month`,
                            icon: IndianRupee,
                            accent: "bg-primary-brand/10 text-primary-brand",
                        },
                        {
                            label: "Avg Order Value",
                            value: `₹${avgOrderValue.toLocaleString("en-IN")}`,
                            sub: `${mockAnalytics.totalOrders} total orders`,
                            icon: ShoppingCart,
                            accent: "bg-tint-sky text-primary-brand",
                        },
                        {
                            label: "Completion Rate",
                            value: `${completionRate}%`,
                            sub: `${completedCount} of ${mockOrders.length} orders`,
                            icon: CheckCircle2,
                            accent: "bg-tint-sky text-primary-brand",
                        },
                        {
                            label: "Collection Rate",
                            value: `${collectionRate}%`,
                            sub: `₹${pendingCollection.toLocaleString("en-IN")} pending`,
                            icon: CreditCard,
                            accent: "bg-tint-peach text-charcoal",
                        },
                    ].map((kpi) => (
                        <div key={kpi.label} className="rounded-lg border border-hairline bg-canvas p-5">
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs text-steel font-medium">{kpi.label}</p>
                                <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${kpi.accent}`}>
                                    <kpi.icon className="h-3.5 w-3.5" />
                                </div>
                            </div>
                            <p className="text-xl font-display font-medium text-ink">{kpi.value}</p>
                            <p className="text-xs text-stone mt-1">{kpi.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row 1 ─────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Revenue Trend (bar chart) */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <BarChart3 className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-charcoal">Monthly Revenue</p>
                                <p className="text-xs text-stone">2025 year to date</p>
                            </div>
                        </div>

                        {/* Bar chart */}
                        <div className="flex items-end gap-4 h-36 px-2 mb-3">
                            {months.map((m) => {
                                const heightPct = (m.revenue / (maxMonthlyRevenue * 1.1)) * 100;
                                return (
                                    <div key={m.month} className="flex flex-col items-center gap-1.5 flex-1">
                                        <span className="text-[10px] text-steel font-medium">
                                            ₹{(m.revenue / 1000).toFixed(1)}k
                                        </span>
                                        <div className="w-full flex-1 flex items-end">
                                            <div
                                                className="w-full rounded-t-lg bg-primary-brand transition-all"
                                                style={{ height: `${heightPct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-stone font-medium">{m.month}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Growth badge */}
                        <div className="flex items-center justify-end gap-1.5 text-xs text-charcoal font-medium">
                            <TrendingUp className="h-3.5 w-3.5" />
                            +{momGrowth}% MoM growth
                        </div>
                    </div>

                    {/* Order Status Donut */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-7 w-7 rounded-lg bg-tint-sky flex items-center justify-center">
                                <PieChart className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-charcoal">Order Status</p>
                                <p className="text-xs text-stone">Current breakdown</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            {/* Donut */}
                            <div className="relative shrink-0">
                                <div
                                    className="h-32 w-32 rounded-full"
                                    style={{ background: donutGradient }}
                                />
                                {/* Center hole */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-20 w-20 rounded-full bg-canvas flex flex-col items-center justify-center">
                                        <p className="text-lg font-display font-medium text-ink">{statusTotal}</p>
                                        <p className="text-[10px] text-stone">orders</p>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex-1 space-y-2.5">
                                {donutSegments.map((s) => (
                                    <div key={s.status} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                            <span className="text-xs text-slate">{s.status}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-16 bg-surface rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate w-4 text-right">{s.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Charts Row 2 ─────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Revenue by Service */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-7 w-7 rounded-lg bg-tint-sky flex items-center justify-center">
                                <IndianRupee className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-charcoal">Revenue by Service</p>
                                <p className="text-xs text-stone">Top earners</p>
                            </div>
                        </div>

                        <div className="space-y-3.5">
                            {revenueByService.map(([service, revenue]) => {
                                const pct = Math.round((revenue / maxSvcRevenue) * 100);
                                return (
                                    <div key={service} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate font-medium truncate max-w-[60%]">{service}</span>
                                            <span className="text-charcoal font-semibold">₹{revenue.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-primary-brand transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment Health */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="h-7 w-7 rounded-lg bg-tint-peach flex items-center justify-center">
                                <CreditCard className="h-3.5 w-3.5 text-charcoal" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-charcoal">Payment Health</p>
                                <p className="text-xs text-stone">Collection vs outstanding</p>
                            </div>
                        </div>

                        {/* Summary row */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                            {paymentBreakdown.map((pb) => (
                                <div key={pb.label} className="rounded-lg bg-surface p-3 text-center">
                                    <div className="h-2.5 w-2.5 rounded-full mx-auto mb-1.5" style={{ backgroundColor: pb.color }} />
                                    <p className="text-[11px] text-steel">{pb.label}</p>
                                    <p className="text-sm font-display font-medium text-ink mt-0.5">₹{pb.amount.toLocaleString("en-IN")}</p>
                                </div>
                            ))}
                        </div>

                        {/* Stacked bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-steel">
                                <span>Collection progress</span>
                                <span className="font-semibold text-charcoal">{collectionRate}%</span>
                            </div>
                            <div className="h-3 rounded-full bg-surface overflow-hidden flex">
                                <div className="h-full bg-primary-brand transition-all" style={{ width: `${collectionRate}%` }} />
                                <div className="h-full bg-bloom-coral transition-all" style={{ width: `${Math.round((pendingCollection / mockAnalytics.totalRevenue) * 100)}%` }} />
                            </div>
                            <div className="flex gap-3 text-[11px] text-stone">
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary-brand inline-block" /> Collected</span>
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-bloom-coral inline-block" /> Pending</span>
                                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-error-brand inline-block" /> Refunded</span>
                            </div>
                        </div>

                        {/* 3rd party placeholder */}
                        <div className="mt-5 rounded-lg border-2 border-dashed border-hairline p-4 text-center">
                            <p className="text-xs text-stone">PostHog / Mixpanel embed — configure integration to enable</p>
                        </div>
                    </div>
                </div>

                {/* ── Additional Stats ─────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Active Orders", value: mockAnalytics.activeOrders, icon: ShoppingCart, color: "text-primary-brand" },
                        { label: "Total Customers", value: mockAnalytics.totalCustomers, icon: Users, color: "text-primary-brand" },
                        { label: "Avg Order Value", value: `₹${avgOrderValue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-charcoal" },
                        { label: "MoM Growth", value: `+${momGrowth}%`, icon: TrendingUp, color: "text-storm-deep" },
                    ].map((s) => (
                        <div key={s.label} className="rounded-lg border border-hairline bg-canvas px-5 py-4 flex items-center gap-4">
                            <s.icon className={`h-6 w-6 shrink-0 ${s.color}`} />
                            <div>
                                <p className="text-[11px] text-stone">{s.label}</p>
                                <p className="text-base font-display font-medium text-ink">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
