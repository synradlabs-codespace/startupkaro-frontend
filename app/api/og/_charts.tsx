// app/api/og/_charts.tsx
//
// Satori-safe chart renderers for the tool result cards. Satori has no
// canvas/recharts, so charts are drawn as inline SVG (path/rect only) with
// labels and legends as flex <div>s. Palette comes from CHART_COLORS in
// features/tools/lib/engines.ts (DESIGN.md brand blues + storm accent).

import type { CardChart, ChartSeries } from "@/features/tools/lib/engines";
import { CHARCOAL, GRAPHITE, HAIRLINE, INK } from "./_shared";

type Fmt = (value: number) => string;

const label = (size: number) => ({ fontSize: `${size}px`, fontWeight: 500, color: GRAPHITE });

function Legend({ items, size }: { items: { label: string; color: string; dashed?: boolean }[]; size: number }) {
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", marginTop: "12px" }}>
            {items.map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", fontSize: `${size}px`, fontWeight: 500, color: CHARCOAL }}>
                    <div
                        style={{
                            display: "flex",
                            width: "14px",
                            height: item.dashed ? "4px" : "14px",
                            borderRadius: "3px",
                            backgroundColor: item.color,
                            marginRight: "8px",
                        }}
                    />
                    {item.label}
                </div>
            ))}
        </div>
    );
}

/** Plain <rect> elements (no component/fragment: Satori's SVG serialiser only handles raw elements). */
function gridlines(w: number, h: number) {
    return [0, 0.25, 0.5, 0.75, 1].map((t) => <rect key={`g-${t}`} x={0} y={Math.min(h - 1, Math.round(h * t))} width={w} height={1} fill={HAIRLINE} />);
}

function XLabels({ labels, size }: { labels: string[]; size: number }) {
    if (labels.length === 0) return null;
    const picks = labels.length <= 2 ? labels : [labels[0], labels[Math.floor((labels.length - 1) / 2)], labels[labels.length - 1]];
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", ...label(size) }}>
            {picks.map((l, i) => (
                <div key={`${l}-${i}`} style={{ display: "flex" }}>{l}</div>
            ))}
        </div>
    );
}

function AreaChart({ series, xLabels, w, h, fmt, size }: { series: ChartSeries[]; xLabels: string[]; w: number; h: number; fmt: Fmt; size: number }) {
    const all = series.flatMap((s) => s.values);
    const max = Math.max(1, ...all);
    const lowest = Math.min(...all);
    // Zoom the y-axis when every value sits high (e.g. an FD that grows 20%),
    // otherwise the lines look flat. Start at 0 when values span a wide range.
    const min = lowest > max * 0.4 ? lowest * 0.95 : 0;
    const points = (values: number[]) => {
        const v = values.length === 1 ? [values[0], values[0]] : values;
        return v.map((value, i) => [(i / (v.length - 1)) * w, h - ((value - min) / (max - min || 1)) * h * 0.94] as const);
    };
    const line = (values: number[]) => points(values).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = (values: number[]) => `${line(values)} L${w},${h} L0,${h} Z`;

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", ...label(size) }}>
                <div style={{ display: "flex" }}>{fmt(max)}</div>
                {min > 0 ? <div style={{ display: "flex" }}>{`Axis from ${fmt(min)}`}</div> : null}
            </div>
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                {[
                    ...gridlines(w, h),
                    ...series.filter((s) => !s.dashed).map((s, idx) => (
                        <path key={`a-${s.label}`} d={area(s.values)} fill={s.color} fillOpacity={idx === 0 ? 0.16 : 0.1} />
                    )),
                    ...series.map((s) => (
                        <path
                            key={`l-${s.label}`}
                            d={line(s.values)}
                            fill="none"
                            stroke={s.color}
                            strokeWidth={4}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            {...(s.dashed ? { strokeDasharray: "10 8" } : {})}
                        />
                    )),
                ]}
            </svg>
            <XLabels labels={xLabels} size={size} />
            <Legend items={series} size={size} />
        </div>
    );
}

function StackedBars({ series, xLabels, w, h, fmt, size }: { series: ChartSeries[]; xLabels: string[]; w: number; h: number; fmt: Fmt; size: number }) {
    const count = xLabels.length;
    const totals = xLabels.map((_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
    const max = Math.max(1, ...totals);
    const slot = w / Math.max(1, count);
    const barW = Math.max(3, slot * 0.68);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", marginBottom: "6px", ...label(size) }}>{fmt(max)}</div>
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                {[
                    ...gridlines(w, h),
                    ...xLabels.flatMap((_, i) => {
                        let y = h;
                        return series.map((s) => {
                            const bh = ((s.values[i] ?? 0) / max) * h * 0.96;
                            y -= bh;
                            return <rect key={`${s.label}-${i}`} x={i * slot + (slot - barW) / 2} y={y} width={barW} height={Math.max(0, bh)} fill={s.color} />;
                        });
                    }),
                ]}
            </svg>
            <XLabels labels={xLabels} size={size} />
            <Legend items={series} size={size} />
        </div>
    );
}

function arc(cx: number, cy: number, r: number, start: number, end: number) {
    const sweep = Math.min(end - start, Math.PI * 2 - 0.0001);
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(start + sweep);
    const y2 = cy + r * Math.sin(start + sweep);
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0} 1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

function Donut({ segments, d, fmt, size, percentValues = false }: { segments: { label: string; value: number; color: string }[]; d: number; fmt: Fmt; size: number; percentValues?: boolean }) {
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
    const stroke = d * 0.17;
    const r = d / 2 - stroke / 2;
    // Precompute start angles (cumulative), starting at 12 o'clock.
    const sweeps = segments.map((s) => (s.value / total) * Math.PI * 2);
    const starts = sweeps.map((_, i) => -Math.PI / 2 + sweeps.slice(0, i).reduce((a, b) => a + b, 0));

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`}>
                {segments
                    .map((s, i) => ({ s, start: starts[i], sweep: sweeps[i] }))
                    .filter(({ sweep }) => sweep > 0)
                    .map(({ s, start, sweep }) => (
                        <path key={s.label} d={arc(d / 2, d / 2, r, start, start + sweep)} fill="none" stroke={s.color} strokeWidth={stroke} />
                    ))}
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {segments.map((s) => (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: `${size}px`, fontWeight: 500, color: CHARCOAL }}>
                            <div style={{ display: "flex", width: "14px", height: "14px", borderRadius: "3px", backgroundColor: s.color, marginRight: "8px" }} />
                            {percentValues ? s.label : `${s.label} · ${Math.round((s.value / total) * 100)}%`}
                        </div>
                        <div style={{ display: "flex", fontSize: `${size + 6}px`, fontWeight: 500, color: INK, marginLeft: "22px" }}>{fmt(s.value)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Bars({ bars, h, size }: { bars: { label: string; value: number; color: string; caption: string }[]; h: number; size: number }) {
    const max = Math.max(1, ...bars.map((b) => b.value));
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "40px", height: `${h + size * 4}px`, borderBottom: `2px solid ${HAIRLINE}` }}>
            {bars.map((b) => (
                <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", fontSize: `${size + 6}px`, fontWeight: 500, color: INK, marginBottom: "8px" }}>{b.caption}</div>
                    <div style={{ display: "flex", width: "100%", height: `${Math.max(4, (b.value / max) * h)}px`, backgroundColor: b.color, borderRadius: "6px 6px 0 0" }} />
                </div>
            ))}
        </div>
    );
}

export function CardChartView({ chart, width, height, fmt, size }: { chart: CardChart; width: number; height: number; fmt: Fmt; size: number }) {
    let body;
    switch (chart.kind) {
        case "area":
            body = <AreaChart series={chart.series} xLabels={chart.xLabels} w={width} h={height} fmt={fmt} size={size} />;
            break;
        case "stacked":
            body = <StackedBars series={chart.series} xLabels={chart.xLabels} w={width} h={height} fmt={fmt} size={size} />;
            break;
        case "donut":
            body = <Donut segments={chart.segments} d={Math.min(height + 40, width * 0.5)} fmt={chart.valueFormat === "percent" ? (v) => `${Number(v.toFixed(2))}%` : fmt} size={size} percentValues={chart.valueFormat === "percent"} />;
            break;
        case "bars":
            body = (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Bars bars={chart.bars} h={height - size * 3} size={size} />
                    <div style={{ display: "flex", gap: "40px", marginTop: "10px" }}>
                        {chart.bars.map((b) => (
                            <div key={b.label} style={{ display: "flex", flex: 1, justifyContent: "center", fontSize: `${size}px`, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GRAPHITE }}>
                                {b.label}
                            </div>
                        ))}
                    </div>
                </div>
            );
            break;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", width: `${width}px` }}>
            <div style={{ display: "flex", fontSize: `${size}px`, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GRAPHITE, marginBottom: "12px" }}>
                {chart.title}
            </div>
            {body}
        </div>
    );
}
