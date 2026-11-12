"use client";

// Lumpsum, FD and PPF share one layout: inputs, maturity tiles, inflation
// adjusted value, a donut and a growth chart.

import { useMemo } from "react";
import { FD_FIELDS, LUMPSUM_FIELDS, PPF_FIELDS, RD_FIELDS, TOOL_ENGINES, fdFromInputs, lumpsumFromInputs, ppfFromInputs, rdFromInputs } from "@/features/tools/lib/engines";
import type { FieldSpec, NumberFieldSpec, ToolInputs } from "@/features/tools/lib/params";
import { formatINR, formatINRCompact, formatPercent } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, GrowthChart, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import type { CalculatorProps } from "./types";

type Variant = "lumpsum" | "fd" | "ppf" | "rd";

const FIELDS: Record<Variant, readonly FieldSpec[]> = { lumpsum: LUMPSUM_FIELDS, fd: FD_FIELDS, ppf: PPF_FIELDS, rd: RD_FIELDS };
const COMPUTE = { lumpsum: lumpsumFromInputs, fd: fdFromInputs, ppf: ppfFromInputs, rd: rdFromInputs };

const INFLATION_HINT = "Shows what the maturity amount is worth in today's money. India's long-run average is around 5 to 6%. Set to 0 to ignore inflation.";

export function SavingsCalculator({ slug, name, category, initial, variant }: CalculatorProps & { variant: Variant }) {
    const fields = FIELDS[variant];
    const { inputs, setField, query } = useToolInputs<ToolInputs>(fields, initial, { slug, category });
    const result = useMemo(() => COMPUTE[variant](inputs), [inputs, variant]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const num = (key: string) => Number(inputs[key]);
    const inf = num("inf");

    const field = (key: string, label: string, unit: "currency" | "percent" | "years" | "months", extra: { sliderMax?: number; hint?: string } = {}) => {
        const s = fields.find((f) => f.key === key) as NumberFieldSpec;
        return (
            <NumberSliderField
                label={label}
                unit={unit}
                min={s.min}
                max={s.max}
                step={s.step}
                sliderMax={extra.sliderMax}
                hint={extra.hint}
                value={num(key)}
                onChange={(v) => setField(key, v)}
            />
        );
    };

    const yearsLabel = variant === "fd" || variant === "rd" ? `${num("t")} months` : `${num("y")} years`;

    return (
        <CalculatorShell
            inputs={
                <>
                    {variant === "lumpsum" && (
                        <>
                            {field("p", "One-time investment", "currency", { sliderMax: 10_000_000 })}
                            {field("r", "Expected return (p.a.)", "percent")}
                            {field("y", "Time period", "years")}
                        </>
                    )}
                    {variant === "fd" && (
                        <>
                            {field("p", "Deposit amount", "currency", { sliderMax: 10_000_000 })}
                            {field("r", "Interest rate (p.a.)", "percent")}
                            {field("t", "Tenure", "months", { hint: "From 3 months to 10 years." })}
                            <SegmentedField
                                label="Interest compounded"
                                value={String(inputs.c)}
                                onChange={(v) => setField("c", v)}
                                options={[
                                    { value: "q", label: "Quarterly" },
                                    { value: "m", label: "Monthly" },
                                    { value: "h", label: "Half-yearly" },
                                    { value: "a", label: "Yearly" },
                                ]}
                            />
                        </>
                    )}
                    {variant === "ppf" && (
                        <>
                            {field("a", "Yearly investment", "currency", { hint: "Between ₹500 and ₹1,50,000 a year." })}
                            {field("r", "PPF interest rate (p.a.)", "percent", { hint: "Currently 7.1%, set by the government every quarter." })}
                            {field("y", "Time period", "years", { hint: "15 year lock-in, then extend in blocks of 5 years." })}
                        </>
                    )}
                    {variant === "rd" && (
                        <>
                            {field("m", "Monthly deposit", "currency", { sliderMax: 200_000 })}
                            {field("r", "Interest rate (p.a.)", "percent")}
                            {field("t", "Tenure", "months", { hint: "From 6 months to 10 years, in steps of 3 months." })}
                        </>
                    )}
                    {field("inf", "Expected inflation (p.a.)", "percent", { hint: INFLATION_HINT })}
                </>
            }
            results={
                <>
                    <StatTile label="Maturity value" value={formatINRCompact(result.maturity)} note={formatINR(result.maturity)} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label={variant === "fd" ? "Deposit" : "Invested"} value={formatINRCompact(result.invested)} />
                        <StatTile label={variant === "lumpsum" ? "Est. returns" : "Interest earned"} value={formatINRCompact(result.returns)} />
                    </div>
                    {inf > 0 && (
                        <StatTile
                            label="Worth in today's money"
                            value={formatINRCompact(result.realMaturity)}
                            note={`What ${formatINRCompact(result.maturity)} after ${yearsLabel} can buy today, at ${formatPercent(inf)} inflation.`}
                        />
                    )}
                    {variant === "fd" && "effectiveYield" in result && (
                        <p className="text-xs text-slate">Effective annual yield: {formatPercent(result.effectiveYield as number, 2)}. FD interest is taxed at your slab rate.</p>
                    )}
                    <BreakdownDonut
                        data={[
                            { name: variant === "fd" ? "Deposit" : "Invested", value: result.invested, color: TOOL_COLORS.secondary },
                            { name: variant === "lumpsum" ? "Est. returns" : "Interest", value: result.returns, color: TOOL_COLORS.primary },
                        ]}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                    <h3 className="font-display text-xl font-medium text-ink">Growth over time</h3>
                    <div className="mt-4">
                        <GrowthChart
                            data={result.series.map((p) => ({ label: p.label, invested: Math.round(p.invested), value: Math.round(p.value), real: Math.round(p.real) }))}
                            series={[
                                { key: "value", label: "Value", color: TOOL_COLORS.primary },
                                { key: "invested", label: variant === "fd" ? "Deposit" : "Invested", color: TOOL_COLORS.accent },
                                ...(inf > 0 ? [{ key: "real", label: "In today's money", color: "#9cc3fb" }] : []),
                            ]}
                        />
                    </div>
                </div>
            }
        />
    );
}
