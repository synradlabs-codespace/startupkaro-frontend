"use client";

// TDS, break-even and equity dilution calculators.

import { useMemo } from "react";
import {
    BREAK_EVEN_FIELDS,
    DILUTION_FIELDS,
    TDS_FIELDS,
    TDS_NATURES,
    TOOL_ENGINES,
    breakEvenFromInputs,
    dilutionFromInputs,
    tdsFromInputs,
} from "@/features/tools/lib/engines";
import type { FieldSpec, NumberFieldSpec, ToolInputs } from "@/features/tools/lib/params";
import { TDS_RULES, type TdsNature } from "@/features/tools/data/tax-rules";
import { formatINR, formatINRCompact, formatNumber, formatPercent } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell, ResultRow, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, GrowthChart, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import type { CalculatorProps } from "./types";

function makeField(fields: readonly FieldSpec[], inputs: ToolInputs, setField: (key: string, value: number | string) => void) {
    return function renderField(key: string, label: string, unit: "currency" | "percent" | "none", extra: { sliderMax?: number; hint?: string; hideSlider?: boolean } = {}) {
        const s = fields.find((f) => f.key === key) as NumberFieldSpec;
        return (
            <NumberSliderField
                label={label}
                unit={unit}
                min={s.min}
                max={s.max}
                step={s.step}
                {...extra}
                value={Number(inputs[key])}
                onChange={(v) => setField(key, v)}
            />
        );
    };
}

// ── TDS ─────────────────────────────────────────────────────────────────
export function TdsCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(TDS_FIELDS, initial, { slug, category });
    const r = useMemo(() => tdsFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(TDS_FIELDS, inputs, setField);
    const rule = TDS_RULES[inputs.n as TdsNature];
    const rent = rule.basis === "monthly";

    return (
        <CalculatorShell
            inputs={
                <>
                    <div className="space-y-2.5">
                        <label htmlFor="tds-nature" className="text-sm font-medium text-charcoal">Nature of payment</label>
                        <select
                            id="tds-nature"
                            value={String(inputs.n)}
                            onChange={(e) => setField("n", e.target.value)}
                            className="h-10 w-full rounded-md border border-hairline-strong bg-canvas px-3 text-sm text-ink outline-none focus:border-primary-brand focus:ring-2 focus:ring-primary-brand/20"
                        >
                            {TDS_NATURES.map((key) => (
                                <option key={key} value={key}>
                                    {TDS_RULES[key].label} ({TDS_RULES[key].section}, {TDS_RULES[key].rate * 100}%)
                                </option>
                            ))}
                        </select>
                    </div>
                    {field("a", rent ? "Rent for the month" : "This payment", "currency", { hideSlider: true })}
                    {!rent && field("t", "Total paid to this payee this year (incl. this payment)", "currency", { hideSlider: true, hint: "The threshold is checked on the yearly total." })}
                    <SegmentedField
                        label="Does the payee have a valid PAN?"
                        value={String(inputs.pan)}
                        onChange={(v) => setField("pan", v)}
                        options={[
                            { value: "y", label: "Yes" },
                            { value: "n", label: "No (20%)" },
                        ]}
                    />
                </>
            }
            results={
                <>
                    <StatTile label="TDS to deduct" value={formatINR(r.tds)} note={r.reason} emphasis />
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Section" value={r.section} />
                        <ResultRow label="TDS rate" value={formatPercent(r.rate)} />
                        <ResultRow label="Payment amount" value={formatINR(Number(inputs.a))} />
                        <ResultRow label="Net payable to payee" value={formatINR(r.netPayable)} strong />
                    </div>
                    <p className="text-xs text-slate">Deposit TDS by the 7th of the next month (30 April for March) and file the quarterly TDS return.</p>
                    <BreakdownDonut
                        data={[
                            { name: "Paid to payee", value: r.netPayable, color: TOOL_COLORS.primary },
                            { name: "TDS to government", value: r.tds, color: TOOL_COLORS.secondary },
                        ]}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}

// ── Break-even ──────────────────────────────────────────────────────────
export function BreakEvenCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(BREAK_EVEN_FIELDS, initial, { slug, category });
    const r = useMemo(() => breakEvenFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(BREAK_EVEN_FIELDS, inputs, setField);

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("f", "Fixed costs per month", "currency", { sliderMax: 5_000_000, hint: "Rent, salaries, software, loan EMIs: costs that don't change with sales." })}
                    {field("p", "Selling price per unit", "currency", { sliderMax: 100_000 })}
                    {field("vc", "Variable cost per unit", "currency", { sliderMax: 100_000, hint: "Materials, packaging, delivery, payment fees per unit sold." })}
                    {field("u", "Expected sales per month (units)", "none", { sliderMax: 20_000 })}
                </>
            }
            results={
                <>
                    {r.possible ? (
                        <StatTile label="Break-even point" value={`${formatNumber(r.units)} units / month`} note={`${formatINR(r.revenue)} in monthly revenue`} emphasis />
                    ) : (
                        <div className="rounded-xl border border-hairline bg-canvas p-4 text-sm text-charcoal">
                            <p className="font-semibold text-ink">No break-even point</p>
                            <p className="mt-1">Each sale loses money because the variable cost is equal to or higher than the price. Raise the price or cut unit costs.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Contribution / unit" value={formatINR(r.contribution)} note={`${formatPercent(r.contributionMarginPct)} margin`} />
                        <StatTile label="Profit at expected sales" value={formatINRCompact(r.expectedProfit)} />
                    </div>
                    {r.possible && Number(inputs.u) > 0 && (
                        <p className="text-sm text-charcoal">
                            Margin of safety: <strong className="text-ink">{formatPercent(r.marginOfSafetyPct)}</strong>
                            {r.marginOfSafetyPct >= 0 ? " (sales can fall this much before you make a loss)." : " (you are below break-even at expected sales)."}
                        </p>
                    )}
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                    <h3 className="font-display text-xl font-medium text-ink">Revenue vs total cost</h3>
                    <div className="mt-4">
                        <GrowthChart
                            data={r.series.map((p) => ({ label: p.label, revenue: Math.round(p.revenue), cost: Math.round(p.cost) }))}
                            series={[
                                { key: "revenue", label: "Revenue", color: TOOL_COLORS.primary },
                                { key: "cost", label: "Total cost", color: TOOL_COLORS.accent },
                            ]}
                        />
                    </div>
                </div>
            }
        />
    );
}

// ── Equity dilution ─────────────────────────────────────────────────────
export function EquityDilutionCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(DILUTION_FIELDS, initial, { slug, category });
    const r = useMemo(() => dilutionFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(DILUTION_FIELDS, inputs, setField);
    const pct = (v: number) => formatPercent(v, 2);

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("pre", "Pre-money valuation", "currency", { sliderMax: 1_000_000_000 })}
                    {field("inv", "Amount raised", "currency", { sliderMax: 500_000_000 })}
                    {field("own", "Founders' ownership today", "percent", { hint: "Combined founder stake before this round." })}
                    {field("esop", "New ESOP pool (post-money)", "percent", { hint: "Investors usually ask for a 10 to 15% pool, created before the round." })}
                </>
            }
            results={
                <>
                    <StatTile label="Founders after the round" value={pct(r.foundersPct)} note={`Down from ${pct(r.foundersBeforePct)}, worth ${formatINRCompact(r.founderStakeValue)} on paper`} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Investor stake" value={pct(r.investorPct)} />
                        <StatTile label="Post-money valuation" value={formatINRCompact(r.postMoney)} />
                    </div>
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Founders" value={pct(r.foundersPct)} />
                        <ResultRow label="New investor" value={pct(r.investorPct)} />
                        <ResultRow label="ESOP pool" value={pct(r.esopPct)} />
                        {r.othersPct > 0.001 && <ResultRow label="Other existing shareholders" value={pct(r.othersPct)} />}
                        <ResultRow label="Total" value="100%" strong />
                    </div>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}
