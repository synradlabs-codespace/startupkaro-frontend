"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { formatOrderStatus } from "@/components/custom/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
    useByServiceAnalytics,
    useOrdersAnalytics,
    usePaymentHealthAnalytics,
    useRevenueAnalytics,
    type AnalyticsRange,
} from "@/features/admin/hooks/useAdminAnalytics";
import { useTrafficAnalytics } from "@/features/admin/hooks/useTrafficAnalytics";
import { pathnameToLabel } from "@/features/admin/lib/pathname-labels";
import { formatINR } from "@/lib/currency";
import type { AdminRevenueAnalytics, AdminRevenuePoint, AdminServiceAnalytics } from "@/services/admin.service";
import { AlertTriangle, BarChart3, CheckCircle2, ChevronLeft, ChevronRight, CreditCard, Globe, IndianRupee, PieChart as PieChartIcon, Share2, ShoppingCart, TrendingUp, Users } from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from "recharts";

type BusinessPeriod = "30d" | "90d" | "12m" | "all";

const BUSINESS_PERIODS: Record<BusinessPeriod, { label: string; granularity: "day" | "month"; days?: number }> = {
    "30d": { label: "Last 30 Days", granularity: "day", days: 30 },
    "90d": { label: "Last 90 Days", granularity: "day", days: 90 },
    "12m": { label: "Last 12 Months", granularity: "month", days: 365 },
    all: { label: "All Time", granularity: "month" },
};

function monthKey(date: Date) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function currentMonthKey() {
    return monthKey(new Date());
}

function shiftMonthKey(month: string, delta: number) {
    const [year, monthNum] = month.split("-").map(Number);
    return monthKey(new Date(Date.UTC(year, monthNum - 1 + delta, 1)));
}

function formatMonthLabel(month: string) {
    const [year, monthNum] = month.split("-").map(Number);
    return new Date(Date.UTC(year, monthNum - 1, 1)).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
}

function daysInMonth(month: string) {
    const [year, monthNum] = month.split("-").map(Number);
    return new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const EARLIEST_YEAR = 2025;
function selectableYears() {
    const currentYear = new Date().getUTCFullYear();
    return Array.from({ length: currentYear - EARLIEST_YEAR + 1 }, (_, i) => EARLIEST_YEAR + i);
}

const statusColors: Record<string, string> = {
    pending: "#ff5050",
    confirmed: "#296ef9",
    in_progress: "#356373",
    completed: "#2f855a",
    cancelled: "#b3262b",
};

// Shared categorical palette for series without a fixed color mapping
// (top pages, service revenue). Reuses the same tokens as statusColors so
// the page reads as one consistent visual system.
const CATEGORICAL_PALETTE = ["#296ef9", "#356373", "#ff5050", "#2f855a", "#b3262b", "#c2c2c2"];

// ChartTooltipContent's `formatter` prop replaces the entire tooltip row
// (indicator + label + value), not just the value text, so every chart here
// builds its own row rather than relying on the default number formatting.
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

function businessPeriodToParams(period: BusinessPeriod): AnalyticsRange {
    const config = BUSINESS_PERIODS[period];
    if (!config.days) {
        return { from: "2025-01-01T00:00:00.000Z", granularity: config.granularity };
    }
    const from = new Date();
    from.setDate(from.getDate() - config.days);
    return { from: from.toISOString(), granularity: config.granularity };
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Analytics data is unavailable";
}

type TrendPoint = { day: number; visitors: number };

// Aligns two different months' daily trends on one X axis by day-of-month
// (1st vs 1st, 2nd vs 2nd, ...) rather than by calendar date, so "this month
// vs last month" overlays meaningfully despite months having different
// lengths. Days with no recorded pageviews fill in as 0, not a gap — HogQL's
// GROUP BY only returns rows for days that had at least one event.
function mergeMonthlyTrends(currentMonth: string, current: TrendPoint[], compareMonth: string, compare: TrendPoint[]) {
    const today = new Date();
    const isCurrentMonthOngoing = currentMonth === monthKey(today);
    const currentDayLimit = isCurrentMonthOngoing ? today.getUTCDate() : daysInMonth(currentMonth);
    const compareDayLimit = compareMonth === monthKey(today) ? today.getUTCDate() : daysInMonth(compareMonth);
    const dayLimit = Math.max(currentDayLimit, compareDayLimit);

    const currentByDay = new Map(current.map((point) => [point.day, point.visitors]));
    const compareByDay = new Map(compare.map((point) => [point.day, point.visitors]));

    return Array.from({ length: dayLimit }, (_, i) => {
        const day = i + 1;
        return {
            day,
            current: day <= currentDayLimit ? (currentByDay.get(day) ?? 0) : null,
            compare: day <= compareDayLimit ? (compareByDay.get(day) ?? 0) : null,
        };
    });
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
    const [businessPeriod, setBusinessPeriod] = useState<BusinessPeriod>("30d");
    // The comparison month defaults to last month — "this month vs last
    // month" is the most useful first view. The current month is always
    // shown alongside it as the fixed baseline (not user-selectable).
    const [compareMonth, setCompareMonth] = useState<string>(() => shiftMonthKey(currentMonthKey(), -1));
    const params = useMemo(() => businessPeriodToParams(businessPeriod), [businessPeriod]);
    const sharedParams = useMemo(() => ({ from: params.from, to: params.to }), [params.from, params.to]);
    const thisMonth = currentMonthKey();

    const revenueQuery = useRevenueAnalytics(params);
    const ordersQuery = useOrdersAnalytics(sharedParams);
    const byServiceQuery = useByServiceAnalytics(sharedParams);
    const paymentHealthQuery = usePaymentHealthAnalytics(sharedParams);
    // React Query dedupes these into a single request when compareMonth === thisMonth.
    const currentTrafficQuery = useTrafficAnalytics(thisMonth);
    const compareTrafficQuery = useTrafficAnalytics(compareMonth);
    const trafficLoading = currentTrafficQuery.isLoading || compareTrafficQuery.isLoading;
    const trafficError = currentTrafficQuery.isError || compareTrafficQuery.isError;

    const orders = ordersQuery.data;
    const paymentHealth = paymentHealthQuery.data;
    const revenue = normalizeRevenue(revenueQuery.data);
    const services = normalizeServiceRows(byServiceQuery.data);
    const traffic = currentTrafficQuery.data;
    const trend = useMemo(
        () => mergeMonthlyTrends(thisMonth, currentTrafficQuery.data?.trend ?? [], compareMonth, compareTrafficQuery.data?.trend ?? []),
        [thisMonth, currentTrafficQuery.data, compareMonth, compareTrafficQuery.data]
    );

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
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-semibold text-ink">Business Performance</h2>
                        <p className="text-sm text-stone">Revenue, orders, and payments</p>
                    </div>
                    <Select value={businessPeriod} onValueChange={(value) => setBusinessPeriod((value ?? "30d") as BusinessPeriod)}>
                        <SelectTrigger className="w-[170px]">
                            <SelectValue>{BUSINESS_PERIODS[businessPeriod].label}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(BUSINESS_PERIODS) as BusinessPeriod[]).map((key) => (
                                <SelectItem key={key} value={key}>{BUSINESS_PERIODS[key].label}</SelectItem>
                            ))}
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

                {/*
                    Each panel gets the full row instead of pairing two per row.
                    Revenue Trend and the horizontal bar charts (Revenue by
                    Service, payment channels, Most Viewed Pages) genuinely need
                    the extra width — long service/page names were truncating
                    into unreadable labels at half-width, and time series read
                    better with more horizontal room per point.
                */}
                <div className="space-y-6">
                    <Panel title="Revenue Trend" subtitle="Captured payments over time" icon={BarChart3}>
                        {revenueQuery.isLoading ? (
                            <LoadingText label="Loading revenue..." />
                        ) : revenueQuery.isError ? (
                            <ErrorText message={errorMessage(revenueQuery.error)} />
                        ) : (
                            <RevenueAreaChart points={revenue.points} />
                        )}
                    </Panel>

                    <Panel title="Order Status" subtitle="Counts and value by order stage" icon={PieChartIcon}>
                        {ordersQuery.isLoading ? (
                            <LoadingText label="Loading orders..." />
                        ) : ordersQuery.isError ? (
                            <ErrorText message={errorMessage(ordersQuery.error)} />
                        ) : (
                            <OrderStatusDonut rows={orders?.byStatus ?? []} total={totalOrders} />
                        )}
                    </Panel>

                    <Panel title="Revenue by Service" subtitle="Top services by captured revenue" icon={IndianRupee}>
                        {byServiceQuery.isLoading ? (
                            <LoadingText label="Loading services..." />
                        ) : byServiceQuery.isError ? (
                            <ErrorText message={errorMessage(byServiceQuery.error)} />
                        ) : (
                            <ServiceRevenueChart rows={services} />
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

                <div className="border-t border-hairline pt-6">
                    <div className="mb-4">
                        <h2 className="text-base font-semibold text-ink">Website Visitors</h2>
                        <p className="text-sm text-stone">How many people are visiting the website, and what they look at</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                        <KpiCard
                            label="Visitors Today"
                            value={currentTrafficQuery.isLoading ? "..." : currentTrafficQuery.isError ? "—" : String(traffic?.today ?? 0)}
                            sub="People who visited today"
                            icon={Users}
                            accent="bg-primary-brand/10 text-primary-brand"
                            loading={currentTrafficQuery.isLoading}
                        />
                        <KpiCard
                            label="Last 7 Days"
                            value={currentTrafficQuery.isLoading ? "..." : currentTrafficQuery.isError ? "—" : String(traffic?.last7Days ?? 0)}
                            sub="People who visited in the last week"
                            icon={Users}
                            accent="bg-tint-sky text-primary-brand"
                            loading={currentTrafficQuery.isLoading}
                        />
                        <KpiCard
                            label="Last 30 Days"
                            value={currentTrafficQuery.isLoading ? "..." : currentTrafficQuery.isError ? "—" : String(traffic?.last30Days ?? 0)}
                            sub="People who visited in the last 30 days"
                            icon={Users}
                            accent="bg-tint-peach text-charcoal"
                            loading={currentTrafficQuery.isLoading}
                        />
                    </div>

                    <div className="mt-6 space-y-6">
                        <Panel
                            title="Visitor Trend"
                            subtitle={
                                compareMonth === thisMonth
                                    ? `Visitors by day in ${formatMonthLabel(thisMonth)}`
                                    : `${formatMonthLabel(thisMonth)} vs ${formatMonthLabel(compareMonth)}, by day of month`
                            }
                            icon={TrendingUp}
                            action={<MonthYearPicker month={compareMonth} onChange={setCompareMonth} />}
                        >
                            {trafficLoading ? (
                                <LoadingText label="Loading visitor trend..." />
                            ) : trafficError ? (
                                <ErrorText message="Visitor data is temporarily unavailable" />
                            ) : (
                                <VisitorComparisonChart
                                    points={trend}
                                    currentLabel={formatMonthLabel(thisMonth)}
                                    compareLabel={formatMonthLabel(compareMonth)}
                                    showCompare={compareMonth !== thisMonth}
                                />
                            )}
                        </Panel>

                        <Panel title="Most Viewed Pages" subtitle={`Where visitors spent their time in ${formatMonthLabel(compareMonth)}`} icon={BarChart3}>
                            {compareTrafficQuery.isLoading ? (
                                <LoadingText label="Loading most viewed pages..." />
                            ) : compareTrafficQuery.isError ? (
                                <ErrorText message="Visitor data is temporarily unavailable" />
                            ) : (
                                <TopPagesChart rows={compareTrafficQuery.data?.topPages ?? []} />
                            )}
                        </Panel>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Panel title="Visitors by Country" subtitle={`Where visitors are located in ${formatMonthLabel(compareMonth)}`} icon={Globe}>
                                {compareTrafficQuery.isLoading ? (
                                    <LoadingText label="Loading countries..." />
                                ) : compareTrafficQuery.isError ? (
                                    <ErrorText message="Visitor data is temporarily unavailable" />
                                ) : (
                                    <CountryChart rows={compareTrafficQuery.data?.byCountry ?? []} />
                                )}
                            </Panel>

                            <Panel title="Traffic Sources" subtitle={`How visitors found the website in ${formatMonthLabel(compareMonth)}`} icon={Share2}>
                                {compareTrafficQuery.isLoading ? (
                                    <LoadingText label="Loading traffic sources..." />
                                ) : compareTrafficQuery.isError ? (
                                    <ErrorText message="Visitor data is temporarily unavailable" />
                                ) : (
                                    <TrafficSourceList rows={compareTrafficQuery.data?.trafficSources ?? []} />
                                )}
                            </Panel>
                        </div>
                    </div>
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

// Lets the admin jump directly to any month/year (the actual ask), while the
// chevrons remain as a quick "step one month" convenience alongside it.
function MonthYearPicker({ month, onChange }: { month: string; onChange: (month: string) => void }) {
    const [year, monthNum] = month.split("-").map(Number);
    const isCurrentYear = year === new Date().getUTCFullYear();
    const canGoNext = month < currentMonthKey();

    return (
        <div className="flex items-center gap-1.5">
            <button
                type="button"
                onClick={() => onChange(shiftMonthKey(month, -1))}
                aria-label="Previous month"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline-strong bg-canvas text-slate transition-colors hover:bg-surface hover:text-ink"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <Select value={String(monthNum)} onValueChange={(value) => value && onChange(`${year}-${value.padStart(2, "0")}`)}>
                <SelectTrigger className="w-[132px]">
                    <SelectValue>{MONTH_NAMES[monthNum - 1]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {MONTH_NAMES.map((name, index) => {
                        const value = String(index + 1);
                        const disabled = isCurrentYear && index + 1 > new Date().getUTCMonth() + 1;
                        return (
                            <SelectItem key={value} value={value} disabled={disabled}>{name}</SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(value) => value && onChange(`${value}-${String(monthNum).padStart(2, "0")}`)}>
                <SelectTrigger className="w-[90px]">
                    <SelectValue>{String(year)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {selectableYears().map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <button
                type="button"
                onClick={() => onChange(shiftMonthKey(month, 1))}
                disabled={!canGoNext}
                aria-label="Next month"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline-strong bg-canvas text-slate transition-colors hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-30"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

function Panel({
    title,
    subtitle,
    icon: Icon,
    action,
    children,
}: {
    title: string;
    subtitle: string;
    icon: typeof BarChart3;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-hairline bg-canvas p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-brand/10">
                        <Icon className="h-3.5 w-3.5 text-primary-brand" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-charcoal">{title}</p>
                        <p className="text-xs text-stone">{subtitle}</p>
                    </div>
                </div>
                {action}
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

function EmptyText({ label }: { label: string }) {
    return <p className="rounded-lg border border-hairline bg-surface p-4 text-sm text-slate">{label}</p>;
}

// Horizontal bar charts (service names, channel names, page names) were
// truncating to unreadable fragments at a fixed 130px axis width. Size the
// axis to the actual longest label instead, capped to keep the chart itself
// from being squeezed too thin. Full label is always still available on hover.
function estimateAxisWidth(labels: string[]) {
    const longest = labels.reduce((longestSoFar, label) => Math.max(longestSoFar, label.length), 0);
    return Math.min(260, Math.max(90, longest * 6.6 + 16));
}

function truncateLabel(value: string, max = 34) {
    return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

const compactNumber = (value: number) => (value >= 1000 ? `${Math.round(value / 1000)}k` : String(value));

function RevenueAreaChart({ points }: { points: { label: string; amount: number; count: number }[] }) {
    if (points.length === 0) return <EmptyText label="No captured revenue in this period." />;
    const data = points.slice(-24);
    return (
        <ChartContainer config={{ amount: { label: "Revenue", color: "#296ef9" } }} className="h-72 w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#296ef9" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#296ef9" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={compactNumber} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => tooltipRow("Revenue", formatINR(Number(value)))} />} />
                <Area dataKey="amount" stroke="var(--color-amount)" strokeWidth={2} fill="url(#revenueFill)" />
            </AreaChart>
        </ChartContainer>
    );
}

function OrderStatusDonut({ rows, total }: { rows: { status: string; count: number; value: number }[]; total: number }) {
    if (rows.length === 0) return <EmptyText label="No orders in this period." />;
    const data = rows.map((row) => ({
        status: formatOrderStatus(row.status),
        count: row.count,
        value: row.value,
        fill: statusColors[row.status] ?? "#c2c2c2",
    }));

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <ChartContainer config={{}} className="mx-auto aspect-square h-48 w-48 shrink-0">
                <PieChart>
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                hideLabel
                                nameKey="status"
                                formatter={(value, _name, item) => tooltipRow(String(item.payload.status), `${value} orders`, String(item.payload.fill))}
                            />
                        }
                    />
                    <Pie data={data} dataKey="count" nameKey="status" innerRadius={44} outerRadius={72} paddingAngle={2}>
                        {data.map((entry) => (
                            <Cell key={entry.status} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
            <div className="min-w-0 flex-1 space-y-2.5">
                {rows.map((row) => {
                    const pct = total > 0 ? Math.round((row.count / total) * 100) : 0;
                    return (
                        <div key={row.status} className="flex items-center justify-between gap-3 text-xs">
                            <span className="flex items-center gap-2 font-medium text-slate">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: statusColors[row.status] ?? "#c2c2c2" }} />
                                {formatOrderStatus(row.status)}
                            </span>
                            <span className="shrink-0 text-charcoal">{row.count} · {pct}% · {formatINR(row.value)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ServiceRevenueChart({ rows }: { rows: ReturnType<typeof normalizeServiceRows> }) {
    if (rows.length === 0) return <EmptyText label="No service revenue in this period." />;
    const data = [...rows].sort((a, b) => b.revenue - a.revenue).slice(0, 10).map((row) => ({ ...row, label: truncateLabel(row.name) }));
    const height = Math.max(data.length * 34, 140);
    const axisWidth = estimateAxisWidth(data.map((row) => row.label));

    return (
        <ChartContainer config={{ revenue: { label: "Revenue", color: "#296ef9" } }} className="w-full" style={{ height }}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={compactNumber} />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={axisWidth} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value, _name, item) => tooltipRow(String(item.payload.name), formatINR(Number(value)))} />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ChartContainer>
    );
}

function PaymentHealth({ data }: { data: ReturnType<typeof usePaymentHealthAnalytics>["data"] }) {
    if (!data) return <EmptyText label="No payment health data in this period." />;
    const channels = data.paymentsByChannel ?? [];
    const channelHeight = Math.max(channels.length * 34, 120);
    const channelData = channels.map((row) => ({ channel: truncateLabel(row.channel.replace(/_/g, " ")), amount: row.amount }));
    const channelAxisWidth = estimateAxisWidth(channelData.map((row) => row.channel));

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
                {channelData.length === 0 ? (
                    <EmptyText label="No payment channels." />
                ) : (
                    <ChartContainer config={{ amount: { label: "Amount", color: "#296ef9" } }} className="w-full" style={{ height: channelHeight }}>
                        <BarChart data={channelData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={compactNumber} />
                            <YAxis type="category" dataKey="channel" tickLine={false} axisLine={false} width={channelAxisWidth} />
                            <ChartTooltip content={<ChartTooltipContent formatter={(value, _name, item) => tooltipRow(String(item.payload.channel), formatINR(Number(value)))} />} />
                            <Bar dataKey="amount" fill="var(--color-amount)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </div>
    );
}

const COMPARE_COLOR = "#356373";

function VisitorComparisonChart({
    points,
    currentLabel,
    compareLabel,
    showCompare,
}: {
    points: { day: number; current: number | null; compare: number | null }[];
    currentLabel: string;
    compareLabel: string;
    showCompare: boolean;
}) {
    if (points.length === 0) return <EmptyText label="No visitor data yet for this period." />;
    return (
        <ChartContainer
            config={{
                current: { label: currentLabel, color: "#296ef9" },
                ...(showCompare ? { compare: { label: compareLabel, color: COMPARE_COLOR } } : {}),
            }}
            className="h-72 w-full"
        >
            <AreaChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                    <linearGradient id="currentMonthFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#296ef9" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#296ef9" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} type="number" domain={["dataMin", "dataMax"]} allowDecimals={false} />
                <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(_, payload) => `Day ${payload?.[0]?.payload?.day ?? ""}`}
                            formatter={(value, name) => tooltipRow(name === "current" ? currentLabel : compareLabel, `${value ?? "—"} visitors`, name === "current" ? "#296ef9" : COMPARE_COLOR)}
                        />
                    }
                />
                {showCompare && <ChartLegend content={<ChartLegendContent />} />}
                <Area dataKey="current" name="current" stroke="var(--color-current)" strokeWidth={2} fill="url(#currentMonthFill)" connectNulls />
                {showCompare && (
                    <Area dataKey="compare" name="compare" stroke="var(--color-compare)" strokeWidth={2} fill="none" strokeDasharray="4 3" connectNulls />
                )}
            </AreaChart>
        </ChartContainer>
    );
}

function TopPagesChart({ rows }: { rows: { pathname: string; views: number }[] }) {
    if (rows.length === 0) return <EmptyText label="No page views yet for this period." />;
    const data = rows.map((row, index) => ({
        page: truncateLabel(pathnameToLabel(row.pathname)),
        views: row.views,
        fill: CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length],
    }));
    const height = Math.max(data.length * 34, 140);
    const axisWidth = estimateAxisWidth(data.map((row) => row.page));

    return (
        <ChartContainer config={{ views: { label: "Views" } }} className="w-full" style={{ height }}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="page" tickLine={false} axisLine={false} width={axisWidth} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value, _name, item) => tooltipRow(String(item.payload.page), `${value} views`, String(item.payload.fill))} />} />
                <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                    {data.map((entry) => (
                        <Cell key={entry.page} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}

function CountryChart({ rows }: { rows: { country: string; visitors: number }[] }) {
    if (rows.length === 0) return <EmptyText label="No visitor location data yet." />;
    const data = rows.map((row, index) => ({
        country: truncateLabel(row.country),
        visitors: row.visitors,
        fill: CATEGORICAL_PALETTE[index % CATEGORICAL_PALETTE.length],
    }));
    const height = Math.max(data.length * 34, 140);
    const axisWidth = estimateAxisWidth(data.map((row) => row.country));

    return (
        <ChartContainer config={{ visitors: { label: "Visitors" } }} className="w-full" style={{ height }}>
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="country" tickLine={false} axisLine={false} width={axisWidth} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value, _name, item) => tooltipRow(String(item.payload.country), `${value} visitors`, String(item.payload.fill))} />} />
                <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                    {data.map((entry) => (
                        <Cell key={entry.country} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}

function TrafficSourceList({ rows }: { rows: { source: string; visitors: number }[] }) {
    if (rows.length === 0) return <EmptyText label="No traffic source data yet." />;
    const max = Math.max(...rows.map((row) => row.visitors), 1);
    return (
        <div className="space-y-3">
            {rows.map((row) => (
                <div key={row.source} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="max-w-[70%] truncate font-medium text-slate">{row.source}</span>
                        <span className="font-semibold text-charcoal">{row.visitors} visitors</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div className="h-full rounded-full bg-primary-brand" style={{ width: `${Math.round((row.visitors / max) * 100)}%` }} />
                    </div>
                </div>
            ))}
        </div>
    );
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
