"use client";

// NPS, CAGR / XIRR and business structure calculators.

import { useMemo } from "react";
import Link from "next/link";
import { UnderlineAnimation } from "@/components/fancy/text";
import { CheckCircle2 } from "lucide-react";
import {
    CAGR_FIELDS,
    NPS_FIELDS,
    STRUCTURE_FIELDS,
    TOOL_ENGINES,
    cagrFromInputs,
    npsFromInputs,
    structureFromInputs,
} from "@/features/tools/lib/engines";
import { STRUCTURES } from "@/features/tools/lib/calculators/planning";
import type { FieldSpec, NumberFieldSpec, ToolInputs } from "@/features/tools/lib/params";
import { NPS } from "@/features/tools/data/tax-rules";
import { formatINR, formatINRCompact, formatPercent } from "@/features/tools/lib/format";
import { useToolInputs } from "@/features/tools/hooks/useToolInputs";
import { NumberSliderField } from "../ui/NumberSliderField";
import { SegmentedField } from "../ui/SegmentedField";
import { CalculatorShell, ResultRow, StatTile } from "../ui/CalculatorShell";
import { BreakdownDonut, GrowthChart, TOOL_COLORS } from "../ui/charts";
import { ShareResultBar } from "../ui/ShareResultBar";
import { cn } from "@/lib/utils";
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

// ── NPS ─────────────────────────────────────────────────────────────────
export function NpsCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(NPS_FIELDS, initial, { slug, category });
    const r = useMemo(() => npsFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(NPS_FIELDS, inputs, setField);
    const inf = Number(inputs.inf);

    return (
        <CalculatorShell
            inputs={
                <>
                    {field("m", "Monthly contribution", "currency", { sliderMax: 100_000 })}
                    {field("ag", "Your current age", "years")}
                    {field("ra", "Retirement age", "years", { hint: "Normal exit is at 60. You can defer up to 75 for contributions." })}
                    {field("r", "Expected return (p.a.)", "percent", { hint: "Equity-heavy NPS portfolios have returned around 9 to 12% over the long term." })}
                    {field("s", "Annual step-up", "percent")}
                    {field("an", "Share used to buy annuity", "percent", { hint: `At least ${NPS.minAnnuityPct}% for non-government subscribers (${NPS.govtMinAnnuityPct}% for government employees).` })}
                    {field("ar", "Expected annuity rate (p.a.)", "percent")}
                    {field("inf", "Expected inflation (p.a.)", "percent", { hint: "Shows your pension in today's money. Set to 0 to ignore inflation." })}
                </>
            }
            results={
                <>
                    <StatTile label="Corpus at retirement" value={formatINRCompact(r.corpus)} note={`After ${r.years} years, on ${formatINRCompact(r.invested)} invested`} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Lump sum" value={formatINRCompact(r.lumpSum)} />
                        <StatTile label="Monthly pension" value={formatINR(r.monthlyPension)} />
                    </div>
                    {inf > 0 && (
                        <StatTile
                            label="Pension in today's money"
                            value={formatINR(r.realMonthlyPension)}
                            note={`What ${formatINR(r.monthlyPension)} a month buys today, at ${formatPercent(inf)} inflation.`}
                        />
                    )}
                    {r.fullWithdrawalAllowed && (
                        <p className="text-xs text-slate">Your corpus is within ₹8 lakh, so you can withdraw all of it as a lump sum.</p>
                    )}
                    <BreakdownDonut
                        data={[
                            { name: "Lump sum", value: r.lumpSum, color: TOOL_COLORS.primary },
                            { name: "Annuity (pension)", value: r.annuityCorpus, color: TOOL_COLORS.secondary },
                        ]}
                    />
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                    <h3 className="font-display text-xl font-medium text-ink">Corpus growth by age</h3>
                    <div className="mt-4">
                        <GrowthChart
                            data={r.series.map((p) => ({ label: p.label, value: Math.round(p.value), invested: Math.round(p.invested), real: Math.round(p.real) }))}
                            series={[
                                { key: "value", label: "Corpus", color: TOOL_COLORS.primary },
                                { key: "invested", label: "Invested", color: TOOL_COLORS.accent },
                                ...(inf > 0 ? [{ key: "real", label: "In today's money", color: "#9cc3fb" }] : []),
                            ]}
                        />
                    </div>
                </div>
            }
        />
    );
}

// ── CAGR / XIRR ─────────────────────────────────────────────────────────
export function CagrCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(CAGR_FIELDS, initial, { slug, category });
    const r = useMemo(() => cagrFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(CAGR_FIELDS, inputs, setField);
    const sip = inputs.md === "sip";

    return (
        <CalculatorShell
            inputs={
                <>
                    <SegmentedField
                        label="Calculate"
                        value={String(inputs.md)}
                        onChange={(v) => setField("md", v)}
                        options={[
                            { value: "cagr", label: "CAGR (one-time)" },
                            { value: "sip", label: "XIRR (monthly SIP)" },
                        ]}
                    />
                    {sip ? (
                        <>
                            {field("m", "Monthly SIP amount", "currency", { sliderMax: 200_000 })}
                            {field("n", "Number of instalments paid", "months", { sliderMax: 360 })}
                            {field("cv", "Current value", "currency", { sliderMax: 50_000_000 })}
                        </>
                    ) : (
                        <>
                            {field("sv", "Starting value", "currency", { sliderMax: 10_000_000 })}
                            {field("ev", "Ending value", "currency", { sliderMax: 50_000_000 })}
                            {field("y", "Period", "years")}
                        </>
                    )}
                </>
            }
            results={
                <>
                    <StatTile label={sip ? "XIRR (annualised return)" : "CAGR"} value={formatPercent(r.ratePct, 2)} note={sip ? "Annualised return on your SIP, accounting for when each instalment went in." : "Compound annual growth rate."} emphasis />
                    <div className="grid grid-cols-2 gap-3">
                        <StatTile label="Absolute return" value={formatPercent(r.absolutePct)} />
                        <StatTile label="Total gain" value={formatINRCompact(r.gain)} />
                    </div>
                    <div className="rounded-xl border border-hairline bg-canvas px-4 py-2">
                        <ResultRow label="Total invested" value={formatINR(r.invested)} />
                        <ResultRow label="Value now" value={formatINR(r.finalValue)} strong />
                    </div>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <div className="rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                    <h3 className="font-display text-xl font-medium text-ink">{sip ? "Growth at this XIRR" : "Growth at this CAGR"}</h3>
                    <div className="mt-4">
                        <GrowthChart
                            data={r.series.map((p) => ({ label: p.label, value: Math.round(p.value), invested: Math.round(p.invested) }))}
                            series={[
                                { key: "value", label: "Value", color: TOOL_COLORS.primary },
                                { key: "invested", label: "Invested", color: TOOL_COLORS.accent },
                            ]}
                        />
                    </div>
                </div>
            }
        />
    );
}

// ── Business structure ──────────────────────────────────────────────────
export function BusinessStructureCalculator({ slug, name, category, initial }: CalculatorProps) {
    const { inputs, setField, query } = useToolInputs<ToolInputs>(STRUCTURE_FIELDS, initial, { slug, category });
    const ranked = useMemo(() => structureFromInputs(inputs), [inputs]);
    const summary = TOOL_ENGINES[slug].cardSummary(inputs).headline;
    const field = makeField(STRUCTURE_FIELDS, inputs, setField);
    const best = ranked[0];

    return (
        <CalculatorShell
            inputs={
                <>
                    <SegmentedField
                        label="How many founders?"
                        value={String(inputs.fo)}
                        onChange={(v) => setField("fo", v)}
                        options={[
                            { value: "1", label: "Just me" },
                            { value: "2", label: "2 or more" },
                        ]}
                    />
                    <SegmentedField label="Plan to raise money from investors?" value={String(inputs.fu)} onChange={(v) => setField("fu", v)} options={YES_NO} />
                    <SegmentedField label="Want to offer ESOPs to employees?" value={String(inputs.es)} onChange={(v) => setField("es", v)} options={YES_NO} />
                    <SegmentedField label="Need to protect personal assets (limited liability)?" value={String(inputs.li)} onChange={(v) => setField("li", v)} options={YES_NO} />
                    {field("pr", "Expected annual profit", "currency", { sliderMax: 20_000_000, hint: "Used to compare income tax across structures." })}
                </>
            }
            results={
                <>
                    <StatTile label="Best fit for you" value={STRUCTURES[best.id].name} note={`Fit score ${best.score}/100`} emphasis />
                    <ol className="space-y-3">
                        {ranked.map((r, idx) => {
                            const facts = STRUCTURES[r.id];
                            return (
                                <li key={r.id} className={cn("rounded-xl border p-4", idx === 0 ? "border-primary-brand/40 bg-tint-sky/30" : "border-hairline bg-canvas", !r.available && "opacity-60")}>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-semibold text-ink">
                                            {idx + 1}. {facts.name}
                                        </p>
                                        <span className="text-sm tabular-nums text-charcoal">{r.available ? `${r.score}/100` : "Not available"}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 w-full rounded-full bg-surface">
                                        <div className="h-1.5 rounded-full bg-primary-brand" style={{ width: `${r.score}%` }} />
                                    </div>
                                    <ul className="mt-3 space-y-1 text-xs text-charcoal">
                                        {r.reasons.slice(0, 3).map((reason) => (
                                            <li key={reason} className="flex gap-1.5">
                                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-brand" />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-2 text-xs text-slate">
                                        Tax on your profit: <strong className="text-ink">{formatINR(r.tax)}</strong> ·{" "}
                                        <Link href={facts.servicePath} className="group font-semibold text-primary-brand">
                                            <UnderlineAnimation lineClassName="bg-primary-brand">Register a {facts.shortName}</UnderlineAnimation>
                                        </Link>
                                    </p>
                                </li>
                            );
                        })}
                    </ol>
                    <ShareResultBar slug={slug} toolName={name} query={query} summary={summary} />
                </>
            }
            below={
                <div className="overflow-x-auto rounded-2xl border border-hairline bg-canvas p-5 sm:p-7">
                    <h3 className="font-display text-xl font-medium text-ink">Side-by-side comparison</h3>
                    <table className="mt-4 w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="border-b border-hairline text-left text-xs uppercase tracking-[0.5px] text-slate">
                                <th className="py-2 pr-4 font-medium">Structure</th>
                                <th className="py-2 pr-4 font-medium">Liability</th>
                                <th className="py-2 pr-4 font-medium">Members</th>
                                <th className="py-2 pr-4 font-medium">Compliance</th>
                                <th className="py-2 pr-4 font-medium">Audit</th>
                                <th className="py-2 font-medium">Fundraising</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(STRUCTURES).map((s) => (
                                <tr key={s.id} className="border-b border-hairline/70 align-top text-charcoal last:border-0">
                                    <td className="py-3 pr-4 font-semibold text-ink">{s.name}</td>
                                    <td className="py-3 pr-4">{s.liability}</td>
                                    <td className="py-3 pr-4">{s.members}</td>
                                    <td className="py-3 pr-4">{s.compliance}</td>
                                    <td className="py-3 pr-4">{s.audit}</td>
                                    <td className="py-3">{s.funding}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        />
    );
}
