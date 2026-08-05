"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { formatOrderStatus } from "@/components/custom/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    useByServiceAnalytics,
    useOrdersAnalytics,
    usePaymentHealthAnalytics,
    useRevenueAnalytics,
    type AnalyticsRange,
} from "@/features/admin/hooks/useAdminAnalytics";
import { formatINR } from "@/lib/currency";
import type { AdminRevenueAnalytics, AdminRevenuePoint, AdminServiceAnalytics } from "@/services/admin.service";
import { AlertTriangle, BarChart3, CheckCircle2, CreditCard, IndianRupee, PieChart, ShoppingCart, TrendingUp } from "lucide-react";

type RangeKey = "30d" | "90d" | "all";

const statusColors: Record<string, string> = {
    pending: "#ff5050",
    confirmed: "#296ef9",
    in_progress: "#356373",
    completed: "#2f855a",
    cancelled: "#b3262b",
};

function rangeToParams(range: RangeKey, granularity: "day" | "month"): AnalyticsRange {
    if (range === "all") {
        return { from: "2025-01-01T00:00:00.000Z", granularity };
    }

    const days = range === "90d" ? 90 : 30;
    const from = new Date();
    from.setDate(from.getDate() - days);
    return { from: from.toISOString(), granularity };
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Analytics data is unavailable";
}

function normalizeRevenue(data: AdminRevenueAnalytics | undefined) {
    const points = (data?.series ?? data?.data ?? data?.points ?? []) as AdminRevenuePoint[];
    const normalized = points.map((point) => ({
        label: point.period ?? point.date ?? point.month ?? "",
        amount: point.revenue ?? point.amount ?? point.total ?? 0,
        count: point.count ?? 0,
    }));
    const total = data?.total ?? data?.totalRevenue ?? data?.revenue ?? normalized.reduce((sum, point) => sum + point.amount, 0);
    return { points: normalized, total };
}

function normalizeServiceRows(data: AdminServiceAnalytics | undefined) {
    return (data?.services ?? []).map((row) => ({
        id: row.id ?? row.serviceId ?? row.name ?? row.serviceName ?? "service",
        name: row.name ?? row.serviceName ?? "Unknown service",
        category: row.category ?? "uncategorized",
        type: row.type ?? "service",
        orders: row.orderCount ?? row.orders ?? row.count ?? 0,
        revenue: row.revenue ?? row.amount ?? 0,
    }));
}

export function AdminAnalyticsPage() {
    const [range, setRange] = useState<RangeKey>("30d");
    const [granularity, setGranularity] = useState<"day" | "month">("day");
    const params = useMemo(() => rangeToParams(range, granularity), [range, granularity]);
    const sharedParams = useMemo(() => ({ from: params.from, to: params.to }), [params.from, params.to]);

    const revenueQuery = useRevenueAnalytics(params);
    const ordersQuery = useOrdersAnalytics(sharedParams);
    const byServiceQuery = useByServiceAnalytics(sharedParams);
    const paymentHealthQuery = usePaymentHealthAnalytics(sharedParams);

    const orders = ordersQuery.data;
    const paymentHealth = paymentHealthQuery.data;
    const revenue = normalizeRevenue(revenueQuery.data);
    const services = normalizeServiceRows(byServiceQuery.data);

    const totalOrders = orders?.totalOrders ?? 0;
    const totalValue = orders?.totalValue ?? 0;
    const collected = orders?.collected ?? revenue.total ?? 0;
    const outstanding = orders?.outstanding ?? Math.max(totalValue - collected, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalValue / totalOrders) : 0;
    const collectionRate = totalValue > 0 ? Math.round((collected / totalValue) * 100) : 0;
    const successRate = paymentHealth?.successRate ?? 0;

    return (
        <div className="flex min-h-screen flex-col">
            <PageHeader title="Analytics" description="Live business performance from backend analytics" />

            <div className="flex-1 space-y-6 p-6">
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={range} onValueChange={(value) => setRange((value ?? "30d") as RangeKey)}>
                        <SelectTrigger className="w-[170px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="all">All data</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={granularity} onValueChange={(value) => setGranularity((value ?? "day") as "day" | "month")}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Daily</SelectItem>
                            <SelectItem value="month">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KpiCard
                        label="Collected Revenue"
                        value={formatINR(collected)}
                        sub={revenueQuery.isError ? "Revenue endpoint unavailable; using orders collected" : "Captured payments"}
                        icon={IndianRupee}
                        accent="bg-primary-brand/10 text-primary-brand"
                        loading={ordersQuery.isLoading && revenueQuery.isLoading}
                    />
                    <KpiCard
                        label="Total Order Value"
                        value={formatINR(totalValue)}
                        sub={`${totalOrders} total orders`}
                        icon={ShoppingCart}
                        accent="bg-tint-sky text-primary-brand"
                        loading={ordersQuery.isLoading}
                    />
                    <KpiCard
                        label="Collection Rate"
                        value={`${collectionRate}%`}
                        sub={`${formatINR(outstanding)} outstanding`}
                        icon={CreditCard}
                        accent="bg-tint-peach text-charcoal"
                        loading={ordersQuery.isLoading}
                    />
                    <KpiCard
                        label="Payment Success"
                        value={paymentHealth?.successRate == null ? "N/A" : `${successRate}%`}
                        sub="Payment health endpoint"
                        icon={CheckCircle2}
                        accent="bg-primary-brand/10 text-primary-brand"
                        loading={paymentHealthQuery.isLoading}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Panel title="Revenue Trend" subtitle="Captured payments over time" icon={BarChart3}>
                        {revenueQuery.isLoading ? (
                            <LoadingText label="Loading revenue..." />
                        ) : revenueQuery.isError ? (
                            <ErrorText message={errorMessage(revenueQuery.error)} />
                        ) : (
                            <RevenueBars points={revenue.points} />
                        )}
                    </Panel>

                    <Panel title="Order Status" subtitle="Counts and value by order stage" icon={PieChart}>
                        {ordersQuery.isLoading ? (
                            <LoadingText label="Loading orders..." />
                        ) : ordersQuery.isError ? (
                            <ErrorText message={errorMessage(ordersQuery.error)} />
                        ) : (
                            <OrderStatusBreakdown rows={orders?.byStatus ?? []} total={totalOrders} />
                        )}
                    </Panel>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Panel title="Revenue by Service" subtitle="Top services by captured revenue" icon={IndianRupee}>
                        {byServiceQuery.isLoading ? (
                            <LoadingText label="Loading services..." />
                        ) : byServiceQuery.isError ? (
                            <ErrorText message={errorMessage(byServiceQuery.error)} />
                        ) : (
                            <ServiceRevenueRows rows={services} />
                        )}
                    </Panel>

                    <Panel title="Payment Health" subtitle="Receipts by status and channel" icon={CreditCard}>
                        {paymentHealthQuery.isLoading ? (
                            <LoadingText label="Loading payment health..." />
                        ) : paymentHealthQuery.isError ? (
                            <ErrorText message={errorMessage(paymentHealthQuery.error)} />
                        ) : (
                            <PaymentHealth data={paymentHealth} />
                        )}
                    </Panel>
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <MiniStat label="Average Order Value" value={formatINR(avgOrderValue)} icon={IndianRupee} />
                    <MiniStat label="Outstanding" value={formatINR(outstanding)} icon={CreditCard} />
                    <MiniStat label="Payment Channels" value={String(paymentHealth?.paymentsByChannel?.length ?? 0)} icon={BarChart3} />
                    <MiniStat label="Services With Revenue" value={String(services.length)} icon={TrendingUp} />
                </div>
            </div>
        </div>
    );
}

function KpiCard({
    label,
    value,
    sub,
    icon: Icon,
    accent,
    loading,
}: {
    label: string;
    value: string;
    sub: string;
    icon: typeof IndianRupee;
    accent: string;
    loading?: boolean;
}) {
    return (
        <div className="rounded-lg border border-hairline bg-canvas p-5">
            <div className="mb-3 flex items-start justify-between">
                <p className="text-xs font-medium text-steel">{label}</p>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${accent}`}>
                    <Icon className="h-3.5 w-3.5" />
                </div>
            </div>
            <p className="font-display text-xl font-medium text-ink">{loading ? "..." : value}</p>
            <p className="mt-1 text-xs text-stone">{sub}</p>
        </div>
    );
}

function Panel({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: typeof BarChart3; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-hairline bg-canvas p-6">
            <div className="mb-5 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-brand/10">
                    <Icon className="h-3.5 w-3.5 text-primary-brand" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-charcoal">{title}</p>
                    <p className="text-xs text-stone">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function LoadingText({ label }: { label: string }) {
    return <p className="rounded-lg border border-hairline bg-surface p-4 text-sm text-slate">{label}</p>;
}

function ErrorText({ message }: { message: string }) {
    return (
        <div className="rounded-lg border border-status-warning-border bg-status-warning-bg p-4 text-sm text-status-warning-fg">
            <div className="mb-1 flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4" />
                Analytics endpoint unavailable
            </div>
            <p className="break-words text-xs leading-relaxed">{message}</p>
        </div>
    );
}

function RevenueBars({ points }: { points: { label: string; amount: number; count: number }[] }) {
    if (points.length === 0) return <EmptyText label="No captured revenue in this period." />;
    const max = Math.max(...points.map((point) => point.amount), 1);
    return (
        <div className="flex h-44 items-end gap-2 overflow-x-auto px-1 pb-1">
            {points.slice(-24).map((point, index) => {
                const height = Math.max((point.amount / max) * 100, point.amount > 0 ? 8 : 2);
                return (
                    <div key={`${point.label}-${index}`} className="flex min-w-10 flex-1 flex-col items-center gap-1.5">
                        <span className="text-[10px] font-medium text-steel">{point.amount ? formatINR(point.amount).replace(".00", "") : "-"}</span>
                        <div className="flex h-28 w-full items-end rounded-t-md bg-surface">
                            <div className="w-full rounded-t-md bg-primary-brand" style={{ height: `${height}%` }} />
                        </div>
                        <span className="max-w-12 truncate text-[10px] text-stone">{point.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

function OrderStatusBreakdown({ rows, total }: { rows: { status: string; count: number; value: number }[]; total: number }) {
    if (rows.length === 0) return <EmptyText label="No orders in this period." />;
    return (
        <div className="space-y-3">
            {rows.map((row) => {
                const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
                const color = statusColors[row.status] ?? "#c2c2c2";
                return (
                    <div key={row.status} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="font-medium text-slate">{formatOrderStatus(row.status)}</span>
                            <span className="text-charcoal">{row.count} orders · {formatINR(row.value)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ServiceRevenueRows({ rows }: { rows: ReturnType<typeof normalizeServiceRows> }) {
    if (rows.length === 0) return <EmptyText label="No service revenue in this period." />;
    const max = Math.max(...rows.map((row) => row.revenue), 1);
    return (
        <div className="space-y-3.5">
            {rows.map((row) => {
                const pct = Math.round((row.revenue / max) * 100);
                return (
                    <div key={row.id} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="max-w-[62%] truncate font-medium text-slate">{row.name}</span>
                            <span className="font-semibold text-charcoal">{formatINR(row.revenue)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                                <div className="h-full rounded-full bg-primary-brand" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-16 text-right text-[11px] text-stone">{row.orders} orders</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function PaymentHealth({ data }: { data: ReturnType<typeof usePaymentHealthAnalytics>["data"] }) {
    if (!data) return <EmptyText label="No payment health data in this period." />;
    const channelMax = Math.max(...(data.paymentsByChannel ?? []).map((row) => row.amount), 1);
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
                {(data.paymentsByStatus ?? []).map((row) => (
                    <div key={row.status} className="rounded-lg bg-surface p-3">
                        <p className="text-xs text-steel">{row.status}</p>
                        <p className="mt-1 font-display text-xl font-medium text-ink">{row.count}</p>
                    </div>
                ))}
                {(data.paymentsByStatus ?? []).length === 0 && <EmptyText label="No payment statuses." />}
            </div>
            <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">Channels</p>
                {(data.paymentsByChannel ?? []).map((row) => (
                    <div key={row.channel} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate">{row.channel.replace(/_/g, " ")}</span>
                            <span className="font-semibold text-charcoal">{formatINR(row.amount)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface">
                            <div className="h-full rounded-full bg-primary-brand" style={{ width: `${Math.round((row.amount / channelMax) * 100)}%` }} />
                        </div>
                    </div>
                ))}
                {(data.paymentsByChannel ?? []).length === 0 && <EmptyText label="No payment channels." />}
            </div>
        </div>
    );
}

function EmptyText({ label }: { label: string }) {
    return <p className="rounded-lg border border-hairline bg-surface p-4 text-sm text-slate">{label}</p>;
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof IndianRupee }) {
    return (
        <div className="flex items-center gap-4 rounded-lg border border-hairline bg-canvas px-5 py-4">
            <Icon className="h-6 w-6 shrink-0 text-primary-brand" />
            <div>
                <p className="text-[11px] text-stone">{label}</p>
                <p className="font-display text-base font-medium text-ink">{value}</p>
            </div>
        </div>
    );
}
