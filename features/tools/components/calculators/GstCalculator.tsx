"use client";

import { useMemo } from "react";
import { GST_FIELDS, TOOL_ENGINES, gstFromInputs } from "@/features/tools/lib/engines";
import { GST_RATES, type GstRate } from "@/features/tools/data/tax-rules";
import { formatINR } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell, ResultRow, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import type { CalculatorProps } from "./types";

type GstInputs = { a: number; g: GstRate; m: "excl" | "incl"; s: "intra" | "inter" };
const amountSpec = GST_FIELDS[0];

export function GstCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<GstInputs>(GST_FIELDS, initial as GstInputs, { slug, category });
    const r = useMemo(() => gstFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const rate = Number(inputs.g);
    const money = (v: number) => formatINR(v, { decimals: true });

    return (
        <CalculatorShell
            inputs={
                <>
                    <SegmentedField
                        label="Amount is"
                        value={inputs.m}
                        onChange={(v) => setField("m", v)}
                        options={[
                            { value: "excl", label: "Before GST (add)" },
                            { value: "incl", label: "Incl. GST (remove)" },
                        ]}
                    />
                    <NumberSliderField
                        label={inputs.m === "excl" ? "Amount before GST" : "Amount including GST"}
                        unit="currency"
                        min={amountSpec.min}
                        max={amountSpec.max}
                        step={amountSpec.step}
                        sliderMax={1_000_000}
                        value={inputs.a}
                        onChange={(v) => setField("a", v)}
                    />
                    <SegmentedField
                        label="GST rate"
                        value={inputs.g}
                        onChange={(v) => setField("g", v)}
                        options={GST_RATES.map((g) => ({ value: g, label: `${g}%` }))}
                    />
                    <SegmentedField
                        label="Type of supply"
                        value={inputs.s}
                        onChange={(v) => setField("s", v)}
                        options={[
                            { value: "intra", label: "Within state" },
                            { value: "inter", label: "Other state" },
                        ]}
                    />
                </>
            }
            results={
                <>
                    <StatTile label={inputs.m === "excl" ? "Total amount (incl. GST)" : "Taxable value (excl. GST)"} value={money(inputs.m === "excl" ? r.total : r.base)} emphasis />
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Taxable value" value={money(r.base)} />
                        {inputs.s === "intra" ? (
                            <>
                                <ResultRow label={`CGST @ ${rate / 2}%`} value={money(r.cgst)} />
                                <ResultRow label={`SGST / UTGST @ ${rate / 2}%`} value={money(r.sgst)} />
                            </>
                        ) : (
                            <ResultRow label={`IGST @ ${rate}%`} value={money(r.igst)} />
                        )}
                        <ResultRow label="Total GST" value={money(r.gst)} />
                        <ResultRow label="Invoice total" value={money(r.total)} strong />
                    </div>
                    <BreakdownDonut
                        data={[
                            { name: "Taxable value", value: r.base, color: TOOL_COLORS.primary },
                            { name: "GST", value: r.gst, color: TOOL_COLORS.secondary },
                        ]}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}
