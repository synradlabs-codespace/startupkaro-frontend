"use client";

import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { INCOME_TAX_FIELDS, TOOL_ENGINES, incomeTaxFromInputs } from "@/features/tools/lib/engines";
import type { NumberFieldSpec } from "@/features/tools/lib/params";
import type { RegimeResult } from "@/features/tools/lib/calculators/incomeTax";
import { TAX_YEAR_LABEL, type AgeGroup } from "@/features/tools/data/tax-rules";
import { formatINR, formatPercent } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell } from "../ui/CalculatorShell";
import { ShareResultBar } from "../ui/ShareResultBar";
import { cn } from "@/lib/utils";
import type { CalculatorProps } from "./types";

type TaxInputs = { i: number; ag: AgeGroup; sl: "y" | "n"; c: number; d: number; h: number; l: number; o: number };
const spec = (key: string) => INCOME_TAX_FIELDS.find((f) => f.key === key) as NumberFieldSpec;

function RegimeCard({ title, result, best }: { title: string; result: RegimeResult; best: boolean }) {
    return (
        <div className={cn("rounded-xl border p-4", best ? "border-primary-brand/40 bg-tint-sky/40" : "border-hairline bg-canvas")}>
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.5px] text-slate">{title}</p>
                {best && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-white">
                        <CheckCircle2 className="h-3 w-3" /> Lower tax
                    </span>
                )}
            </div>
            <p className="mt-1.5 font-display text-2xl font-medium text-ink">{formatINR(result.totalTax)}</p>
            <p className="mt-0.5 text-xs text-slate">Effective rate {formatPercent(result.effectiveRate)}</p>
        </div>
    );
}

export function IncomeTaxCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<TaxInputs>(INCOME_TAX_FIELDS, initial as TaxInputs, { slug, category });
    const r = useMemo(() => incomeTaxFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;

    const num = (key: keyof TaxInputs & string, label: string, sliderMax?: number, hint?: string, hideSlider = false) => {
        const s = spec(key);
        return (
            <NumberSliderField
                label={label}
                unit="currency"
                min={s.min}
                max={s.max}
                step={s.step}
                sliderMax={sliderMax}
                hideSlider={hideSlider}
                value={inputs[key] as number}
                onChange={(v) => setField(key, v)}
                hint={hint}
            />
        );
    };

    const rows: { label: string; pick: (x: RegimeResult) => number; sign?: string; strong?: boolean }[] = [
        { label: "Deductions", pick: (x) => x.deductions, sign: "−" },
        { label: "Taxable income", pick: (x) => x.taxableIncome },
        { label: "Tax on slabs", pick: (x) => x.slabTax },
        { label: "Rebate / marginal relief", pick: (x) => x.rebate, sign: "−" },
        { label: "Surcharge", pick: (x) => x.surcharge },
        { label: "Health & education cess (4%)", pick: (x) => x.cess },
        { label: "Total tax payable", pick: (x) => x.totalTax, strong: true },
    ];

    return (
        <CalculatorShell
            inputs={
                <>
                    {num("i", "Gross annual income", 5_000_000, "Total salary (CTC minus employer PF) plus other income such as interest and rent.")}
                    <SegmentedField
                        label="Age group"
                        value={inputs.ag}
                        onChange={(v) => setField("ag", v)}
                        options={[
                            { value: "below60", label: "Below 60" },
                            { value: "60to80", label: "60 to 80" },
                            { value: "above80", label: "80+" },
                        ]}
                    />
                    <SegmentedField
                        label="Salaried or pensioner?"
                        value={inputs.sl}
                        onChange={(v) => setField("sl", v)}
                        options={[
                            { value: "y", label: "Yes, apply standard deduction" },
                            { value: "n", label: "No" },
                        ]}
                    />
                    <div className="space-y-5 border-t border-hairline pt-5">
                        <div>
                            <p className="text-sm font-semibold text-ink">Old regime deductions</p>
                            <p className="mt-0.5 text-xs text-slate">These only reduce tax under the old regime.</p>
                        </div>
                        {num("c", "80C investments (PPF, ELSS, EPF, LIC…)", undefined, "Capped at ₹1,50,000.")}
                        {num("d", "80D health insurance", undefined, "Self, family and parents. Capped at ₹1,00,000 here.")}
                        {num("h", "HRA exemption", 1_000_000, undefined, true)}
                        {num("l", "Home loan interest (self-occupied)", undefined, "Section 24(b), capped at ₹2,00,000.")}
                        {num("o", "Other deductions (80CCD(1B), 80E, 80G…)", 500_000, undefined, true)}
                    </div>
                </>
            }
            results={
                <>
                    <div className="rounded-xl border border-hairline bg-canvas p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.5px] text-slate">{TAX_YEAR_LABEL} verdict</p>
                        <p className="mt-1.5 font-display text-xl font-medium text-ink sm:text-2xl">
                            {r.better === "same"
                                ? "Both regimes cost the same"
                                : `The ${r.better} regime saves you ${formatINR(r.savings)}`}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <RegimeCard title="New regime" result={r.newRegime} best={r.better === "new"} />
                        <RegimeCard title="Old regime" result={r.oldRegime} best={r.better === "old"} />
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-hairline bg-canvas">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-hairline text-xs uppercase tracking-[0.5px] text-slate">
                                    <th className="px-4 py-2.5 text-left font-medium">Breakdown</th>
                                    <th className="px-4 py-2.5 text-right font-medium">New</th>
                                    <th className="px-4 py-2.5 text-right font-medium">Old</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-hairline/70 text-charcoal">
                                    <td className="px-4 py-2">Gross income</td>
                                    <td className="px-4 py-2 text-right tabular-nums" colSpan={2}>{formatINR(inputs.i)}</td>
                                </tr>
                                {rows.map((row) => (
                                    <tr key={row.label} className={cn("border-b border-hairline/70 last:border-0", row.strong ? "font-semibold text-ink" : "text-charcoal")}>
                                        <td className="px-4 py-2">{row.label}</td>
                                        <td className="px-4 py-2 text-right tabular-nums">{row.sign && row.pick(r.newRegime) > 0 ? row.sign : ""}{formatINR(row.pick(r.newRegime))}</td>
                                        <td className="px-4 py-2 text-right tabular-nums">{row.sign && row.pick(r.oldRegime) > 0 ? row.sign : ""}{formatINR(row.pick(r.oldRegime))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
        />
    );
}
