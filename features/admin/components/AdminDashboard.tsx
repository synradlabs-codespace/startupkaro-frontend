// features/admin/components/AdminDashboard.tsx

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/custom/PageHeader";
import { OrderStatusBadge, PaymentStatusBadge, formatOrderStatus, formatPaymentStatus } from "@/components/custom/StatusBadge";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR } from "@/lib/currency";
import { ALL_TIME, useOrdersAnalytics, usePaymentHealthAnalytics, useRevenueAnalytics } from "@/features/admin/hooks/useAdminAnalytics";
import { useCustomerList } from "@/features/admin/hooks/useAdminCustomers";
import { usePaymentList } from "@/features/admin/hooks/useAdminPayments";
import { useOrderList } from "@/features/admin/hooks/useAdminOrders";
import { formatDate, getAdminOrderPaymentStatus, getAdminOrderServiceName } from "@/features/admin/lib/format";
import {
    Users, IndianRupee,
    CheckCircle2, CreditCard, BarChart3, ArrowRight,
} from "lucide-react";

// Same palette already used for order-status charts on /admin/analytics, so
// the two pages read as one visual system.
const orderStatusColors: Record<string, string> = {
    pending: "#ff5050",
    confirmed: "#296ef9",
    in_progress: "#356373",
    completed: "#2f855a",
    cancelled: "#b3262b",
};

// Mirrors the semantic buckets StatusBadge already assigns payment statuses
// (positive/warning/info/neutral/danger), so this chart's colors agree with
// the PaymentStatusBadge shown in the Recent Orders list below it.
const paymentStatusColors: Record<string, string> = {
    created: "#356373",
    authorized: "#0e3191",
    captured: "#0f6b3a",
    failed: "#b3262b",
    refunded: "#8a5a00",
    voided: "#636363",
};

function formatMonthShort(iso: string) {
    if (!iso) return "";
    return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(iso));
}

function buildMonthlyCounts(dates: string[]) {
    const counts = new Map<string, number>();
    for (const iso of dates) {
        const d = new Date(iso);
        const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([key, value]) => ({ label: formatMonthShort(`${key}-01`), value }));
}

function tooltipRow(label: string, value: string, color?: string) {
    return (
        <div className="flex w-full items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate">
                {color && <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />}
                {label}
            </span>
            <span className="font-mono font-medium tabular-nums text-ink">{value}</span>
        </div>
    );
}

// Stat-tile trend sparkline: a single accent-colored series, no axes, hover
// tooltip only — the KPI number above already carries the headline value.
function MiniTrendChart({ data, color, valueFormatter }: { data: { label: string; value: number }[]; color: string; valueFormatter: (value: number) => string }) {
    if (data.length < 2) {
        return <p className="mt-3 h-14 flex items-center text-xs text-stone">Not enough history yet</p>;
    }
    const gradientId = `dashboard-spark-${color.replace("#", "")}`;
    const chartConfig: ChartConfig = { value: { label: "Value", color } };
    return (
        <ChartContainer config={chartConfig} className="mt-3 aspect-auto h-14 w-full">
            <AreaChart data={data} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="label" hide />
                <YAxis hide domain={[0, (max: number) => Math.max(max * 1.2, 1)]} />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            hideIndicator
                            formatter={(value, _name, item) => tooltipRow(String(item.payload.label), valueFormatter(Number(value)))}
                        />
                    }
                />
                <Area dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
            </AreaChart>
        </ChartContainer>
    );
}

// Stat-tile composition bar: a single stacked row showing how the KPI splits
// across statuses, with a small legend since it is more than one series.
function MiniCompositionChart({ segments }: { segments: { key: string; label: string; value: number; color: string }[] }) {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    if (total === 0) {
        return <p className="mt-3 h-14 flex items-center text-xs text-stone">No data yet</p>;
    }
    const present = segments.filter((segment) => segment.value > 0);
    const chartConfig: ChartConfig = Object.fromEntries(
        present.map((segment) => [segment.key, { label: segment.label, color: segment.color }])
    );
    const row: Record<string, string | number> = { name: "value" };
    for (const segment of present) row[segment.key] = segment.value;

    return (
        <div className="mt-3">
            <ChartContainer config={chartConfig} className="aspect-auto h-8 w-full">
                <BarChart data={[row]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                hideLabel
                                formatter={(value, _name, item) => {
                                    const segment = present.find((s) => s.key === item.dataKey);
                                    return tooltipRow(segment?.label ?? String(item.dataKey), String(value), segment?.color);
                                }}
                            />
                        }
                    />
                    {present.map((segment, index) => (
                        <Bar
                            key={segment.key}
                            dataKey={segment.key}
                            stackId="stack"
                            fill={segment.color}
                            stroke="#ffffff"
                            strokeWidth={2}
                            radius={
                                present.length === 1
                                    ? 4
                                    : index === 0
                                        ? [4, 0, 0, 4]
                                        : index === present.length - 1
                                            ? [0, 4, 4, 0]
                                            : 0
                            }
                        />
                    ))}
                </BarChart>
            </ChartContainer>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {present.map((segment) => (
                    <span key={segment.key} className="flex items-center gap-1 text-[11px] text-stone">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ backgroundColor: segment.color }} />
                        {segment.label} · {segment.value}
                    </span>
                ))}
            </div>
        </div>
    );
}

export function AdminDashboard() {
    const ordersAnalyticsQuery = useOrdersAnalytics(ALL_TIME);
    const revenueTrendQuery = useRevenueAnalytics({ ...ALL_TIME, granularity: "month" });
    const paymentHealthQuery = usePaymentHealthAnalytics(ALL_TIME);
    const customersQuery = useCustomerList({ page: 1, limit: 100 });
    const pendingPaymentsQuery = usePaymentList({ status: "created", page: 1, limit: 1 });
    const recentOrdersQuery = useOrderList({ page: 1, limit: 5 });

    const orders = ordersAnalyticsQuery.data;
    const totalOrders = orders?.totalOrders ?? 0;
    const completedCount = orders?.byStatus.find((s) => s.status === "completed")?.count ?? 0;
    const completionRate = totalOrders > 0 ? Math.round((completedCount / totalOrders) * 100) : 0;

    const totalCustomers = customersQuery.data?.pagination.total;
    const pendingPaymentsCount = pendingPaymentsQuery.data?.pagination.total;
    const recentOrders = recentOrdersQuery.data?.data ?? [];

    const revenueTrend = useMemo(() => {
        const points = revenueTrendQuery.data?.series ?? revenueTrendQuery.data?.data ?? revenueTrendQuery.data?.points ?? [];
        return points
            .map((point) => ({
                label: formatMonthShort(point.period ?? point.date ?? point.month ?? ""),
                value: point.revenue ?? point.amount ?? point.total ?? 0,
            }))
            .slice(-6);
    }, [revenueTrendQuery.data]);

    const customerTrend = useMemo(
        () => buildMonthlyCounts((customersQuery.data?.data ?? []).map((c) => c.createdAt)),
        [customersQuery.data]
    );

    const orderStatusSegments = useMemo(
        () =>
            (orders?.byStatus ?? []).map((row) => ({
                key: row.status,
                label: formatOrderStatus(row.status),
                value: row.count,
                color: orderStatusColors[row.status] ?? "#c2c2c2",
            })),
        [orders]
    );

    const paymentStatusSegments = useMemo(
        () =>
            (paymentHealthQuery.data?.paymentsByStatus ?? []).map((row) => ({
                key: row.status,
                label: formatPaymentStatus(row.status),
                value: row.count,
                color: paymentStatusColors[row.status] ?? "#636363",
            })),
        [paymentHealthQuery.data]
    );

    const stats = [
        {
            label: "Total Revenue",
            value: ordersAnalyticsQuery.isLoading ? "…" : orders ? formatINR(orders.collected) : "—",
            icon: IndianRupee,
            accent: "bg-primary-brand text-white",
            sub: ordersAnalyticsQuery.isError
                ? "Failed to load"
                : orders
                    ? `of ${formatINR(orders.totalValue)} booked`
                    : "",
            chart: revenueTrendQuery.isLoading ? null : (
                <MiniTrendChart data={revenueTrend} color="#296ef9" valueFormatter={formatINR} />
            ),
        },
        {
            label: "Total Customers",
            value: customersQuery.isLoading ? "…" : totalCustomers != null ? String(totalCustomers) : "—",
            icon: Users,
            accent: "bg-tint-sky text-primary-brand",
            sub: customersQuery.isError ? "Failed to load" : "Registered accounts",
            chart: customersQuery.isLoading ? null : (
                <MiniTrendChart data={customerTrend} color="#296ef9" valueFormatter={(v) => `${v} new`} />
            ),
        },
        {
            label: "Order Completion",
            value: ordersAnalyticsQuery.isLoading ? "…" : orders ? `${completionRate}%` : "—",
            icon: CheckCircle2,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: ordersAnalyticsQuery.isError
                ? "Failed to load"
                : orders
                    ? `${completedCount} of ${totalOrders} orders completed`
                    : "",
            chart: ordersAnalyticsQuery.isLoading ? null : <MiniCompositionChart segments={orderStatusSegments} />,
        },
        {
            label: "Pending Payments",
            value: ordersAnalyticsQuery.isLoading ? "…" : orders ? formatINR(orders.outstanding) : "—",
            icon: CreditCard,
            accent: "bg-primary-brand/10 text-primary-brand",
            sub: pendingPaymentsQuery.isError
                ? "Failed to load"
                : pendingPaymentsCount != null
                    ? `${pendingPaymentsCount} payments awaiting capture`
                    : "",
            chart: paymentHealthQuery.isLoading ? null : <MiniCompositionChart segments={paymentStatusSegments} />,
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
                                All-time performance across orders, payments, and customers
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
                            className="rounded-lg border border-hairline bg-canvas p-5"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs font-medium text-steel">{stat.label}</p>
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.accent}`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <p className="text-2xl font-display font-medium text-ink">{stat.value}</p>
                            <p className="mt-1 text-xs text-stone">{stat.sub}</p>
                            {stat.chart}
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
                        {recentOrdersQuery.isLoading ? (
                            <div className="px-6 py-8 text-center text-sm text-stone">Loading orders…</div>
                        ) : recentOrdersQuery.isError ? (
                            <div className="px-6 py-8 text-center text-sm text-stone">Failed to load recent orders</div>
                        ) : recentOrders.length === 0 ? (
                            <div className="px-6 py-8 text-center text-sm text-stone">No orders yet</div>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-soft transition-colors">
                                    <div>
                                        <p className="text-sm font-medium text-charcoal">{order.customer?.name ?? "—"}</p>
                                        <p className="text-xs text-stone">{getAdminOrderServiceName(order)} · {formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-charcoal">{formatINR(order.amount)}</span>
                                        <OrderStatusBadge status={order.status} />
                                        <PaymentStatusBadge status={getAdminOrderPaymentStatus(order)} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
