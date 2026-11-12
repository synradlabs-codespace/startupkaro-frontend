"use client";

// Presumptive tax, advance tax, GST late fee and capital gains calculators.

import { useMemo } from "react";
import {
    ADVANCE_TAX_FIELDS,
    CAPITAL_GAINS_FIELDS,
    GST_LATE_FEE_FIELDS,
    PRESUMPTIVE_FIELDS,
    TOOL_ENGINES,
    advanceTaxFromInputs,
    capitalGainsFromInputs,
    gstLateFeeFromInputs,
    presumptiveFromInputs,
} from "@/features/tools/lib/engines";
import type { FieldSpec, NumberFieldSpec, ToolInputs } from "@/features/tools/lib/params";
import { CII, CII_CURRENT_YEAR, PRESUMPTIVE, TAX_YEAR_LABEL } from "@/features/tools/data/tax-rules";
import { formatINR, formatINRCompact, formatPercent } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell, ResultRow, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import type { CalculatorProps } from "./types";

type Unit = "currency" | "percent" | "years" | "months" | "none";

function makeField(fields: readonly FieldSpec[], inputs: ToolInputs, setField: (key: string, value: number | string) => void) {
    return function renderField(key: string, label: string, unit: Unit, extra: { sliderMax?: number; hint?: string; hideSlider?: boolean } = {}) {
        const s = fields.find((f) => f.key === key) as NumberFieldSpec;
        return (
            <NumberSliderField label={label} unit={unit} min={s.min} max={s.max} step={s.step} {...extra} value={Number(inputs[key])} onChange={(v) => setField(key, v)} />
        );
    };
}

const YES_NO = [
    { value: "y", label: "Yes" },
    { value: "n", label: "No" },
] as const;

const REGIMES = [
    { value: "new", label: "New regime" },
    { value: "old", label: "Old regime" },
] as const;

// ── Presumptive ─────────────────────────────────────────────────────────
export function PresumptiveTaxCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(PRESUMPTIVE_FIELDS, initial, { slug, category });
    const r = useMemo(() => presumptiveFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(PRESUMPTIVE_FIELDS, inputs, setField);
    const business = inputs.k === "business";
    const rules = business ? PRESUMPTIVE.business : PRESUMPTIVE.profession;

    return (
        <CalculatorShell
            inputs={
                <>
                    <SegmentedField
                        label="You are a"
                        value={String(inputs.k)}
                        onChange={(v) => setField("k", v)}
                        options={[
                            { value: "prof", label: "Professional / freelancer" },
                            { value: "business", label: "Small business" },
                        ]}
                    />
                    {field("t", business ? "Annual turnover" : "Annual gross receipts", "currency", { sliderMax: business ? 30_000_000 : 7_500_000 })}
                    {field("dg", "Received through bank / digital modes", "percent", {
                        hint: `If cash receipts are 5% or less, the limit rises to ${formatINRCompact(rules.enhancedLimit)}${business ? " and digital receipts are taxed at 6% instead of 8%" : ""}.`,
                    })}
                    <SegmentedField label="Tax regime" value={String(inputs.rg)} onChange={(v) => setField("rg", v)} options={REGIMES} />
                    <SegmentedField
                        label="Age group"
                        value={String(inputs.ag)}
                        onChange={(v) => setField("ag", v)}
                        options={[
                            { value: "below60", label: "Below 60" },
                            { value: "60to80", label: "60 to 80" },
                            { value: "above80", label: "80+" },
                        ]}
                    />
                </>
            }
            results={
                <>
                    {r.eligible ? (
                        <StatTile label={`Income tax (${TAX_YEAR_LABEL})`} value={formatINR(r.tax)} note={`${formatPercent(r.effectiveRateOnTurnover, 2)} of your receipts`} emphasis />
                    ) : (
                        <div className="rounded-xl border border-hairline bg-canvas p-4 text-sm text-charcoal">
                            <p className="font-semibold text-ink">Above the presumptive limit</p>
                            <p className="mt-1">Receipts above {formatINRCompact(r.limit)} cannot use the scheme. You need regular books of accounts and, usually, a tax audit.</p>
                        </div>
                    )}
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label={business ? "Turnover" : "Gross receipts"} value={formatINR(Number(inputs.t))} />
                        <ResultRow label={`Deemed profit (${formatPercent(r.profitRate)})`} value={formatINR(r.income)} />
                        <ResultRow label="Scheme limit for you" value={formatINRCompact(r.limit)} />
                        <ResultRow label="Tax payable" value={formatINR(r.tax)} strong />
                    </div>
                    <p className="text-xs text-slate">Under the presumptive scheme, the full advance tax is due in one instalment by 15 March. You can declare higher profit, but declaring lower profit needs books and an audit.</p>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}

// ── Advance tax ─────────────────────────────────────────────────────────
export function AdvanceTaxCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(ADVANCE_TAX_FIELDS, initial, { slug, category });
    const r = useMemo(() => advanceTaxFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(ADVANCE_TAX_FIELDS, inputs, setField);

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("i", "Estimated total income this year", "currency", { sliderMax: 10_000_000, hint: "Salary, business or professional income, interest, rent and capital gains." })}
                    <SegmentedField label="Do you have salary or pension income?" value={String(inputs.sl)} onChange={(v) => setField("sl", v)} options={YES_NO} />
                    <SegmentedField label="Tax regime" value={String(inputs.rg)} onChange={(v) => setField("rg", v)} options={REGIMES} />
                    {field("td", "TDS / TCS already deducted or expected", "currency", { sliderMax: 2_000_000 })}
                    <SegmentedField label="Opted for presumptive tax (44AD / 44ADA)?" value={String(inputs.pr)} onChange={(v) => setField("pr", v)} options={YES_NO} />
                    <SegmentedField label="Senior citizen with no business income?" value={String(inputs.sr)} onChange={(v) => setField("sr", v)} options={YES_NO} />
                </>
            }
            results={
                <>
                    <StatTile label="Advance tax payable" value={formatINR(r.liable ? r.netTax : 0)} note={r.reason} emphasis />
                    <div className="rounded-xl border border-hairline bg-canvas p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.5px] text-slate">Payment schedule ({TAX_YEAR_LABEL})</p>
                        <ul className="mt-3 space-y-2">
                            {r.schedule.map((sch) => (
                                <li key={sch.due} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="text-charcoal">
                                        By {sch.due} <span className="text-slate">({Math.round(sch.cumulative * 100)}% cumulative)</span>
                                    </span>
                                    <span className="font-semibold tabular-nums text-ink">{formatINR(sch.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {r.liable && (
                        <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                            <ResultRow label="Total tax for the year" value={formatINR(r.totalTax)} />
                            <ResultRow label="Less TDS / TCS" value={formatINR(Number(inputs.td))} />
                            <ResultRow label="Interest if you skip all instalments (234C)" value={formatINR(r.interest234C)} />
                            <ResultRow label="Plus interest till 31 July (234B)" value={formatINR(r.interest234B)} />
                        </div>
                    )}
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}

// ── GST late fee ────────────────────────────────────────────────────────
export function GstLateFeeCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(GST_LATE_FEE_FIELDS, initial, { slug, category });
    const r = useMemo(() => gstLateFeeFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(GST_LATE_FEE_FIELDS, inputs, setField);
    const nil = inputs.nil === "y";

    return (
        <CalculatorShell
            inputs={
                <>
                    <SegmentedField
                        label="Return"
                        value={String(inputs.rt)}
                        onChange={(v) => setField("rt", v)}
                        options={[
                            { value: "3b", label: "GSTR-3B" },
                            { value: "1", label: "GSTR-1" },
                        ]}
                    />
                    <SegmentedField label="Nil return?" value={String(inputs.nil)} onChange={(v) => setField("nil", v)} options={YES_NO} />
                    {!nil && (
                        <SegmentedField
                            label="Turnover in the previous year"
                            value={String(inputs.tov)}
                            onChange={(v) => setField("tov", v)}
                            options={[
                                { value: "s", label: "Up to ₹1.5 Cr" },
                                { value: "m", label: "₹1.5 to 5 Cr" },
                                { value: "l", label: "Above ₹5 Cr" },
                            ]}
                        />
                    )}
                    {field("d", "Days late", "none", { sliderMax: 365 })}
                    {inputs.rt === "3b" && !nil && field("tx", "Net tax paid late in cash", "currency", { sliderMax: 2_000_000, hint: "Interest applies only to the cash portion after input tax credit." })}
                </>
            }
            results={
                <>
                    <StatTile label="Total late fee and interest" value={formatINR(r.total)} emphasis />
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Late fee: CGST" value={formatINR(r.cgstFee)} />
                        <ResultRow label="Late fee: SGST" value={formatINR(r.sgstFee)} />
                        <ResultRow label={r.capped ? `Late fee (capped at ${formatINR(r.cap)})` : "Late fee total"} value={formatINR(r.lateFee)} />
                        <ResultRow label="Interest at 18% a year" value={formatINR(r.interest)} />
                        <ResultRow label="Total payable" value={formatINR(r.total)} strong />
                    </div>
                    <BreakdownDonut
                        data={[
                            { name: "Late fee", value: r.lateFee, color: TOOL_COLORS.primary },
                            { name: "Interest", value: r.interest, color: TOOL_COLORS.secondary },
                        ].filter((d) => d.value > 0)}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}

// ── Capital gains ───────────────────────────────────────────────────────
export function CapitalGainsCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(CAPITAL_GAINS_FIELDS, initial, { slug, category });
    const r = useMemo(() => capitalGainsFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(CAPITAL_GAINS_FIELDS, inputs, setField);
    const asset = String(inputs.as);
    const by = Number(inputs.by);

    return (
        <CalculatorShell
            inputs={
                <>
                    <SegmentedField
                        label="What did you sell?"
                        value={asset}
                        onChange={(v) => setField("as", v)}
                        options={[
                            { value: "eq", label: "Listed shares / equity MF" },
                            { value: "prop", label: "Land or building" },
                            { value: "oth", label: "Gold, unlisted shares, other" },
                        ]}
                    />
                    {field("b", "Purchase price", "currency", { sliderMax: 20_000_000 })}
                    {field("s", "Sale price", "currency", { sliderMax: 20_000_000 })}
                    {field("m", "Holding period", "months", { sliderMax: 360, hint: asset === "eq" ? "Long term after 12 months." : "Long term after 24 months." })}
                    {asset === "eq" && field("ex", "LTCG exemption still available this year", "currency", { hint: "₹1.25 lakh a year across all equity gains." })}
                    {asset !== "eq" && (
                        <SegmentedField
                            label="Your income tax slab (for short-term gains)"
                            value={String(inputs.sb)}
                            onChange={(v) => setField("sb", v)}
                            options={["0", "5", "10", "15", "20", "25", "30"].map((v) => ({ value: v, label: `${v}%` }))}
                        />
                    )}
                    {asset === "prop" && (
                        <>
                            <SegmentedField label="Bought before 23 July 2024?" value={String(inputs.pre)} onChange={(v) => setField("pre", v)} options={YES_NO} />
                            {inputs.pre === "y" &&
                                field("by", "Financial year of purchase (starting)", "none", {
                                    hint: `FY ${by}-${String(by + 1).slice(2)}: cost inflation index ${CII[by] ?? "N/A"} vs ${CII[CII_CURRENT_YEAR]} now. For property bought before 2001, use its value on 1 April 2001.`,
                                })}
                        </>
                    )}
                </>
            }
            results={
                <>
                    <StatTile label="Capital gains tax" value={formatINR(r.tax)} note={r.rateLabel} emphasis />
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Capital gain" value={formatINR(r.gain)} />
                        <ResultRow label="Type" value={r.gain <= 0 ? "Capital loss" : r.longTerm ? "Long term" : "Short term"} />
                        <ResultRow label="Taxable gain" value={formatINR(r.taxableGain)} />
                        {r.indexed && (
                            <>
                                <ResultRow label="Indexed cost" value={formatINR(r.indexed.indexedCost)} />
                                <ResultRow label="Tax with indexation (20%)" value={formatINR(r.indexed.tax)} />
                                <ResultRow label="Tax without indexation (12.5%)" value={formatINR(r.withoutIndexationTax ?? 0)} />
                            </>
                        )}
                        <ResultRow label="In hand after tax" value={formatINR(r.netProceeds)} strong />
                    </div>
                    {r.gain > 0 && (
                        <BreakdownDonut
                            data={[
                                { name: "Cost", value: Number(inputs.b), color: TOOL_COLORS.secondary },
                                { name: "Gain after tax", value: r.gain - r.tax, color: TOOL_COLORS.primary },
                                { name: "Tax", value: r.tax, color: TOOL_COLORS.accent },
                            ].filter((d) => d.value > 0)}
                        />
                    )}
                    <p className="text-xs text-slate">Includes 4% cess. Surcharge on very high incomes and exemptions such as reinvesting in a new house are not included.</p>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}
