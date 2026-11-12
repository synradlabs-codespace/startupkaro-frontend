"use client";

import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR, formatINRCompact } from "@/features/tools/lib/format";

export const TOOL_COLORS = { primary: "#296ef9", secondary: "#c9e0fc", accent: "#356373" };

export function BreakdownDonut({ data }: { data: { name: string; value: number; color: string }[] }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ChartContainer config={{}} className="aspect-square h-40 w-40 shrink-0">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" formatter={(value, name) => `${name}: ${formatINR(Number(value))}`} />} />
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius={46} outerRadius={72} paddingAngle={2} strokeWidth={0} isAnimationActive={false}>
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
            <ul className="w-full space-y-2">
                {data.map((d) => (
                    <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-charcoal">
                            <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: d.color }} />
                            {d.name}
                        </span>
                        <span className="tabular-nums text-ink">
                            {formatINRCompact(d.value)} <span className="text-slate">· {total > 0 ? Math.round((d.value / total) * 100) : 0}%</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Two-series growth chart (e.g. invested vs value, or balance over time). */
export function GrowthChart({
    data,
    series,
}: {
    data: Record<string, number | string>[];
    series: { key: string; label: string; color: string }[];
}) {
    const config = Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }]));
    return (
        <ChartContainer config={config} className="h-64 w-full">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                    {series.map((s) => (
                        <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={s.color} stopOpacity={0.03} />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(v) => formatINRCompact(Number(v)).replace(" Lakh", "L").replace(" Cr", "Cr")} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => `${config[String(name)]?.label ?? name}: ${formatINR(Number(value))}`} />} />
                {series.map((s) => (
                    <Area key={s.key} dataKey={s.key} type="monotone" stroke={s.color} strokeWidth={2} fill={`url(#fill-${s.key})`} isAnimationActive={false} />
                ))}
            </AreaChart>
        </ChartContainer>
    );
}
