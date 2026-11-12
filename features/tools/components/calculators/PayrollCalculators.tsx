"use client";

// Salary (CTC → in-hand), HRA exemption and gratuity calculators.

import { useMemo } from "react";
import {
    GRATUITY_FIELDS,
    HRA_FIELDS,
    SALARY_FIELDS,
    TOOL_ENGINES,
    gratuityFromInputs,
    hraFromInputs,
    salaryFromInputs,
} from "@/features/tools/lib/engines";
import type { FieldSpec, NumberFieldSpec, ToolInputs } from "@/features/tools/lib/params";
import { GRATUITY, HRA_METRO_CITIES, TAX_YEAR_LABEL } from "@/features/tools/data/tax-rules";
import { formatINR, formatINRCompact } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell, ResultRow, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, GrowthChart, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import { cn } from "@/lib/utils";
import type { CalculatorProps } from "./types";

function makeField(fields: readonly FieldSpec[], inputs: ToolInputs, setField: (key: string, value: number | string) => void) {
    return function renderField(key: string, label: string, unit: "currency" | "percent" | "years" | "months" | "none", extra: { sliderMax?: number; hint?: string; hideSlider?: boolean } = {}) {
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

/** Deduction display: minus sign only for non-zero amounts. */
const less = (v: number) => (v > 0 ? `−${formatINR(v)}` : formatINR(0));

// ── Salary ──────────────────────────────────────────────────────────────
export function SalaryCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(SALARY_FIELDS, initial, { slug, category });
    const r = useMemo(() => salaryFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(SALARY_FIELDS, inputs, setField);

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("c", "Annual CTC", "currency", { sliderMax: 10_000_000 })}
                    {field("b", "Basic salary (% of CTC)", "percent", { hint: "Under the new labour codes, basic pay plus DA is generally at least 50% of total pay." })}
                    <SegmentedField
                        label="Employer PF"
                        value={String(inputs.pf)}
                        onChange={(v) => setField("pf", v)}
                        options={[
                            { value: "capped", label: "12% of ₹15,000" },
                            { value: "full", label: "12% of full basic" },
                            { value: "none", label: "No PF" },
                        ]}
                    />
                    <SegmentedField
                        label="Gratuity included in CTC?"
                        value={String(inputs.g)}
                        onChange={(v) => setField("g", v)}
                        options={[
                            { value: "y", label: "Yes" },
                            { value: "n", label: "No" },
                        ]}
                    />
                    {field("pt", "Professional tax (per year)", "currency", { hint: "Set by your state. Up to ₹2,500 a year; ₹0 in states without it." })}
                    <SegmentedField
                        label="Tax regime"
                        value={String(inputs.rg)}
                        onChange={(v) => setField("rg", v)}
                        options={[
                            { value: "new", label: "New regime" },
                            { value: "old", label: "Old regime" },
                        ]}
                    />
                </>
            }
            results={
                <>
                    <StatTile label="In-hand salary per month" value={formatINR(r.inHandMonthly)} note={`${formatINR(r.inHandAnnual)} a year`} emphasis />
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Annual CTC" value={formatINR(Number(inputs.c))} />
                        <ResultRow label="Employer PF" value={less(r.employerPf)} />
                        {r.gratuity > 0 && <ResultRow label="Gratuity (paid on exit)" value={less(r.gratuity)} />}
                        <ResultRow label="Gross salary" value={formatINR(r.gross)} strong />
                        <ResultRow label="Employee PF" value={less(r.employeePf)} />
                        <ResultRow label="Professional tax" value={less(r.professionalTax)} />
                        <ResultRow label={`Income tax (${TAX_YEAR_LABEL})`} value={less(r.incomeTax)} />
                        <ResultRow label="Take-home (annual)" value={formatINR(r.inHandAnnual)} strong />
                    </div>
                    <BreakdownDonut
                        data={[
                            { name: "In-hand", value: r.inHandAnnual, color: TOOL_COLORS.primary },
                            { name: "Income tax", value: r.incomeTax, color: TOOL_COLORS.accent },
                            { name: "PF (you + employer)", value: r.employeePf + r.employerPf, color: "#9cc3fb" },
                            { name: "Gratuity + PT", value: r.gratuity + r.professionalTax, color: TOOL_COLORS.secondary },
                        ].filter((d) => d.value > 0)}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}

// ── HRA ─────────────────────────────────────────────────────────────────
export function HraCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(HRA_FIELDS, initial, { slug, category });
    const r = useMemo(() => hraFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(HRA_FIELDS, inputs, setField);
    const metro = inputs.m === "y";

    const limits: { key: typeof r.binding; label: string; value: number }[] = [
        { key: "actualHra", label: "Actual HRA received", value: r.limits.actualHra },
        { key: "rentMinusTenPct", label: "Rent paid minus 10% of basic + DA", value: r.limits.rentMinusTenPct },
        { key: "pctOfBasic", label: `${metro ? "50%" : "40%"} of basic + DA`, value: r.limits.pctOfBasic },
    ];

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("b", "Basic salary + DA (per year)", "currency", { sliderMax: 5_000_000 })}
                    {field("h", "HRA received (per year)", "currency", { sliderMax: 3_000_000 })}
                    {field("r", "Rent paid (per year)", "currency", { sliderMax: 3_000_000 })}
                    <SegmentedField
                        label="Do you live in one of the 8 metro cities?"
                        value={String(inputs.m)}
                        onChange={(v) => setField("m", v)}
                        options={[
                            { value: "y", label: "Yes (50%)" },
                            { value: "n", label: "No (40%)" },
                        ]}
                    />
                    <p className="text-xs text-slate">From {TAX_YEAR_LABEL}: {HRA_METRO_CITIES.join(", ")}.</p>
                </>
            }
            results={
                <>
                    <StatTile label="HRA exemption" value={formatINR(r.exempt)} note={`${formatINR(r.exempt / 12)} a month`} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Taxable HRA" value={formatINR(r.taxable)} />
                        <StatTile label="Exempt share" value={`${Number(inputs.h) > 0 ? Math.round((r.exempt / Number(inputs.h)) * 100) : 0}%`} />
                    </div>
                    <div className="rounded-xl border border-hairline bg-canvas p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.5px] text-slate">Exemption is the lowest of</p>
                        <ul className="mt-3 space-y-2">
                            {limits.map((l) => (
                                <li
                                    key={l.key}
                                    className={cn(
                                        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm",
                                        r.binding === l.key ? "bg-tint-sky/50 font-semibold text-ink" : "text-charcoal"
                                    )}
                                >
                                    <span>{l.label}</span>
                                    <span className="tabular-nums">{formatINR(l.value)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-xs text-slate">HRA exemption is available only in the old tax regime. In the new regime, all HRA is taxable.</p>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}

// ── Gratuity ────────────────────────────────────────────────────────────
export function GratuityCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(GRATUITY_FIELDS, initial, { slug, category });
    const r = useMemo(() => gratuityFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(GRATUITY_FIELDS, inputs, setField);

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("s", "Last drawn monthly basic + DA", "currency", { sliderMax: 500_000 })}
                    {field("y", "Years of service", "years")}
                    {field("mo", "Additional months", "months", { hint: "For covered employees, 6 months or more counts as a full year." })}
                    <SegmentedField
                        label="Is your employer covered by the Gratuity Act?"
                        value={String(inputs.cv)}
                        onChange={(v) => setField("cv", v)}
                        options={[
                            { value: "y", label: "Yes (10+ employees)" },
                            { value: "n", label: "No" },
                        ]}
                    />
                </>
            }
            results={
                <>
                    {r.eligible ? (
                        <StatTile label="Gratuity payable" value={formatINR(r.gratuity)} note={`${r.countedYears} years counted`} emphasis />
                    ) : (
                        <div className="rounded-xl border border-hairline bg-canvas p-4 text-sm text-charcoal">
                            <p className="font-semibold text-ink">Not yet eligible</p>
                            <p className="mt-1">Permanent employees need {GRATUITY.minServiceYears} years of continuous service. If you continue, you would receive {formatINR(r.gratuity)} at {r.countedYears || 1} years.</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Tax free" value={formatINRCompact(r.eligible ? r.taxFree : 0)} note={`Limit ${formatINRCompact(GRATUITY.taxFreeLimit)}`} />
                        <StatTile label="Taxable" value={formatINRCompact(r.eligible ? r.taxable : 0)} />
                    </div>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                    <h3 className="font-display text-xl font-medium text-ink">Gratuity by years of service</h3>
                    <div className="mt-4">
                        <GrowthChart
                            data={r.series.map((p) => ({ label: p.label, value: Math.round(p.value) }))}
                            series={[{ key: "value", label: "Gratuity", color: TOOL_COLORS.primary }]}
                        />
                    </div>
                </div>
            }
        />
    );
}
