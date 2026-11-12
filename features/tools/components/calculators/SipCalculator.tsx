"use client";

import { useMemo } from "react";
import { SIP_FIELDS, TOOL_ENGINES, sipFromInputs } from "@/features/tools/lib/engines";
import { formatINR, formatINRCompact, formatPercent } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { CalculatorShell, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, GrowthChart, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import type { CalculatorProps } from "./types";

type SipInputs = { a: number; r: number; y: number; s: number; inf: number };
const spec = (key: string) => {
    const { min, max, step } = SIP_FIELDS.find((f) => f.key === key)!;
    return { min, max, step };
};

export function SipCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<SipInputs>(SIP_FIELDS, initial as SipInputs, { slug, category });
    const result = useMemo(() => sipFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const showReal = inputs.inf > 0;

    return (
        <CalculatorShell
            inputs={
                <>
                    <NumberSliderField label="Monthly investment" unit="currency" {...spec("a")} sliderMax={200_000} value={inputs.a} onChange={(v) => setField("a", v)} />
                    <NumberSliderField label="Expected return (p.a.)" unit="percent" {...spec("r")} value={inputs.r} onChange={(v) => setField("r", v)} />
                    <NumberSliderField label="Time period" unit="years" {...spec("y")} value={inputs.y} onChange={(v) => setField("y", v)} />
                    <NumberSliderField
                        label="Annual step-up"
                        unit="percent"
                        {...spec("s")}
                        value={inputs.s}
                        onChange={(v) => setField("s", v)}
                        hint="Increase your SIP by this % every year. Set to 0 for a flat SIP."
                    />
                    <NumberSliderField
                        label="Expected inflation (p.a.)"
                        unit="percent"
                        {...spec("inf")}
                        value={inputs.inf}
                        onChange={(v) => setField("inf", v)}
                        hint="Used to show what your corpus is worth in today's money. India's long-run average is around 5 to 6%. Set to 0 to ignore inflation."
                    />
                </>
            }
            results={
                <>
                    <StatTile label="Estimated value" value={formatINRCompact(result.maturity)} note={formatINR(result.maturity)} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Invested" value={formatINRCompact(result.invested)} />
                        <StatTile label="Est. returns" value={formatINRCompact(result.returns)} />
                    </div>
                    {showReal && (
                        <StatTile
                            label="Worth in today's money"
                            value={formatINRCompact(result.realMaturity)}
                            note={`What ${formatINRCompact(result.maturity)} in ${inputs.y} years can buy today, at ${formatPercent(inputs.inf)} inflation.`}
                        />
                    )}
                    <BreakdownDonut
                        data={[
                            { name: "Invested amount", value: result.invested, color: TOOL_COLORS.secondary },
                            { name: "Est. returns", value: result.returns, color: TOOL_COLORS.primary },
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
                            data={result.series.map((p) => ({ label: `Yr ${p.year}`, invested: Math.round(p.invested), value: Math.round(p.value), real: Math.round(p.real) }))}
                            series={[
                                { key: "value", label: "Value", color: TOOL_COLORS.primary },
                                { key: "invested", label: "Invested", color: TOOL_COLORS.accent },
                                ...(showReal ? [{ key: "real", label: "In today's money", color: "#9cc3fb" }] : []),
                            ]}
                        />
                    </div>
                </div>
            }
        />
    );
}
