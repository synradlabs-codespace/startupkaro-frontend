// features/tools/lib/engines.ts
//
// Per-tool input schema + pure compute + result-card summary. This module is
// imported by the server page, the client calculators AND the edge OG route
// (app/api/og/tool/[slug]/route.tsx), so it must stay free of React and of
// browser/Node-only APIs.

import { calculateGst, type GstMode, type SupplyType } from "./calculators/gst";
import { calculateIncomeTax, type IncomeTaxInput } from "./calculators/incomeTax";
import { calculateSip } from "./calculators/sip";
import { simulateLoan } from "./calculators/emi";
import { formatINR, formatINRCompact, formatPercent, formatTenure } from "./format";
import type { FieldSpec, ToolInputs } from "./params";
import { GST_RATES, PPF, TAX_YEAR_LABEL, TDS_RULES, type AgeGroup, type TdsNature } from "@/features/tools/data/tax-rules";
import { calculateFd, calculateLumpsum, calculatePpf, type FdCompounding, type GrowthResult } from "./calculators/savings";
import { calculateGratuity, calculateHra, calculateSalary, type PfMode } from "./calculators/payroll";
import { calculateBreakEven, calculateDilution, calculateTds } from "./calculators/business";
import { calculateAdvanceTax, calculateCapitalGains, calculateGstLateFee, calculatePresumptive, type AssetType } from "./calculators/taxPlanning";
import { STRUCTURES, calculateCagr, calculateNps, calculateRd, calculateSipXirr, compareStructures } from "./calculators/planning";

// Brand palette for charts (DESIGN.md): primary blue, soft blue, storm deep.
export const CHART_COLORS = { primary: "#296ef9", soft: "#c9e0fc", mid: "#9cc3fb", storm: "#356373" };

export interface ChartSeries {
    label: string;
    color: string;
    values: number[];
    dashed?: boolean;
}

/** Chart drawn on the result-card image (rendered as SVG by the OG route). */
export type CardChart =
    | { kind: "area"; title: string; xLabels: string[]; series: ChartSeries[] }
    | { kind: "stacked"; title: string; xLabels: string[]; series: ChartSeries[] }
    | { kind: "donut"; title: string; segments: { label: string; value: number; color: string }[]; valueFormat?: "money" | "percent" }
    | { kind: "bars"; title: string; bars: { label: string; value: number; color: string; caption: string }[] };

export interface CardSummary {
    headline: string;
    rows: { label: string; value: string }[];
    chart: CardChart;
}

export interface ToolEngine {
    fields: readonly FieldSpec[];
    /** `symbol` lets the image route swap ₹ for "Rs." if needed. */
    cardSummary: (inputs: ToolInputs, symbol?: string) => CardSummary;
}

const n = (inputs: ToolInputs, key: string) => Number(inputs[key]);
const s = (inputs: ToolInputs, key: string) => String(inputs[key]);

// ── SIP ────────────────────────────────────────────────────────────────
export const SIP_FIELDS = [
    { type: "number", key: "a", min: 100, max: 1_000_000, step: 100, default: 10_000 },
    { type: "number", key: "r", min: 1, max: 30, step: 0.1, default: 12 },
    { type: "number", key: "y", min: 1, max: 60, step: 1, default: 10 },
    { type: "number", key: "s", min: 0, max: 50, step: 1, default: 0 },
    // Inflation used to show the result in today's money. User-adjustable.
    { type: "number", key: "inf", min: 0, max: 15, step: 0.5, default: 6 },
] as const satisfies readonly FieldSpec[];

export function sipFromInputs(inputs: ToolInputs) {
    return calculateSip(n(inputs, "a"), n(inputs, "r"), n(inputs, "y"), n(inputs, "s"), n(inputs, "inf"));
}

// ── Loans ──────────────────────────────────────────────────────────────
export const EMI_FIELDS = [
    { type: "number", key: "p", min: 10_000, max: 100_000_000, step: 1_000, default: 1_000_000 },
    { type: "number", key: "r", min: 1, max: 30, step: 0.05, default: 10.5 },
    { type: "number", key: "y", min: 1, max: 30, step: 1, default: 5 },
] as const satisfies readonly FieldSpec[];

export const HOME_LOAN_FIELDS = [
    { type: "number", key: "p", min: 100_000, max: 100_000_000, step: 10_000, default: 5_000_000 },
    { type: "number", key: "r", min: 5, max: 20, step: 0.05, default: 8.5 },
    { type: "number", key: "y", min: 1, max: 30, step: 1, default: 20 },
    { type: "number", key: "pa", min: 0, max: 10_000_000, step: 5_000, default: 0 },
] as const satisfies readonly FieldSpec[];

export const CAR_LOAN_FIELDS = [
    { type: "number", key: "c", min: 100_000, max: 50_000_000, step: 5_000, default: 1_000_000 },
    { type: "number", key: "d", min: 0, max: 50_000_000, step: 5_000, default: 200_000 },
    { type: "number", key: "r", min: 5, max: 20, step: 0.05, default: 9 },
    { type: "number", key: "y", min: 1, max: 8, step: 1, default: 5 },
] as const satisfies readonly FieldSpec[];

export function emiFromInputs(inputs: ToolInputs) {
    return simulateLoan(n(inputs, "p"), n(inputs, "r"), n(inputs, "y") * 12);
}

export function homeLoanFromInputs(inputs: ToolInputs) {
    return simulateLoan(n(inputs, "p"), n(inputs, "r"), n(inputs, "y") * 12, n(inputs, "pa"));
}

export function carLoanFromInputs(inputs: ToolInputs) {
    const price = n(inputs, "c");
    const down = Math.min(n(inputs, "d"), price);
    return { price, down, ...simulateLoan(price - down, n(inputs, "r"), n(inputs, "y") * 12) };
}

function loanChart(result: ReturnType<typeof simulateLoan>): CardChart {
    return {
        kind: "stacked",
        title: "Yearly repayment: principal vs interest",
        xLabels: result.schedule.map((row) => `Yr ${row.year}`),
        series: [
            { label: "Principal", color: CHART_COLORS.primary, values: result.schedule.map((row) => row.principalPaid + row.prepaid) },
            { label: "Interest", color: CHART_COLORS.mid, values: result.schedule.map((row) => row.interestPaid) },
        ],
    };
}

function loanCard(label: string, result: ReturnType<typeof simulateLoan>, rate: number, symbol: string, extraRows: CardSummary["rows"] = []): CardSummary {
    const rows = [
        { label: "Monthly EMI", value: formatINR(result.emi, { symbol }) },
        { label: "Total interest", value: formatINRCompact(result.totalInterest, { symbol }) },
        { label: "Total payment", value: formatINRCompact(result.totalPayment, { symbol }) },
    ];
    return {
        headline: `${label} of ${formatINRCompact(result.principal, { symbol })} at ${formatPercent(rate, 2)} for ${formatTenure(result.scheduledMonths)}: EMI ${formatINR(result.emi, { symbol })}/month`,
        rows: rows.slice(0, rows.length - extraRows.length).concat(extraRows),
        chart: loanChart(result),
    };
}

// ── GST ────────────────────────────────────────────────────────────────
export const GST_FIELDS = [
    { type: "number", key: "a", min: 1, max: 1_000_000_000, step: 1, default: 10_000 },
    { type: "enum", key: "g", options: GST_RATES, default: "18" },
    { type: "enum", key: "m", options: ["excl", "incl"], default: "excl" },
    { type: "enum", key: "s", options: ["intra", "inter"], default: "intra" },
] as const satisfies readonly FieldSpec[];

export function gstFromInputs(inputs: ToolInputs) {
    return calculateGst(n(inputs, "a"), Number(s(inputs, "g")), s(inputs, "m") as GstMode, s(inputs, "s") as SupplyType);
}

// ── Income tax ─────────────────────────────────────────────────────────
export const INCOME_TAX_FIELDS = [
    { type: "number", key: "i", min: 0, max: 1_000_000_000, step: 1_000, default: 1_500_000 },
    { type: "enum", key: "ag", options: ["below60", "60to80", "above80"], default: "below60" },
    { type: "enum", key: "sl", options: ["y", "n"], default: "y" },
    { type: "number", key: "c", min: 0, max: 150_000, step: 1_000, default: 150_000 },
    { type: "number", key: "d", min: 0, max: 100_000, step: 1_000, default: 25_000 },
    { type: "number", key: "h", min: 0, max: 100_000_000, step: 1_000, default: 0 },
    { type: "number", key: "l", min: 0, max: 200_000, step: 1_000, default: 0 },
    { type: "number", key: "o", min: 0, max: 100_000_000, step: 1_000, default: 0 },
] as const satisfies readonly FieldSpec[];

export function incomeTaxInput(inputs: ToolInputs): IncomeTaxInput {
    return {
        grossIncome: n(inputs, "i"),
        age: s(inputs, "ag") as AgeGroup,
        salaried: s(inputs, "sl") === "y",
        section80C: n(inputs, "c"),
        section80D: n(inputs, "d"),
        hraExemption: n(inputs, "h"),
        homeLoanInterest: n(inputs, "l"),
        otherDeductions: n(inputs, "o"),
    };
}

export function incomeTaxFromInputs(inputs: ToolInputs) {
    return calculateIncomeTax(incomeTaxInput(inputs));
}

// ── Round 2: savings ───────────────────────────────────────────────────
const INFLATION_FIELD = { type: "number", key: "inf", min: 0, max: 15, step: 0.5, default: 6 } as const;

export const LUMPSUM_FIELDS = [
    { type: "number", key: "p", min: 1_000, max: 100_000_000, step: 1_000, default: 500_000 },
    { type: "number", key: "r", min: 1, max: 30, step: 0.1, default: 12 },
    { type: "number", key: "y", min: 1, max: 60, step: 1, default: 15 },
    INFLATION_FIELD,
] as const satisfies readonly FieldSpec[];

export const FD_FIELDS = [
    { type: "number", key: "p", min: 1_000, max: 100_000_000, step: 1_000, default: 500_000 },
    { type: "number", key: "r", min: 1, max: 15, step: 0.05, default: 7 },
    { type: "number", key: "t", min: 3, max: 120, step: 1, default: 36 },
    { type: "enum", key: "c", options: ["q", "m", "h", "a"], default: "q" },
    INFLATION_FIELD,
] as const satisfies readonly FieldSpec[];

export const PPF_FIELDS = [
    { type: "number", key: "a", min: PPF.minYearly, max: PPF.maxYearly, step: 500, default: PPF.maxYearly },
    { type: "number", key: "r", min: 1, max: 12, step: 0.05, default: PPF.rate },
    { type: "number", key: "y", min: 15, max: 50, step: 5, default: 15 },
    INFLATION_FIELD,
] as const satisfies readonly FieldSpec[];

export const lumpsumFromInputs = (i: ToolInputs) => calculateLumpsum(n(i, "p"), n(i, "r"), n(i, "y"), n(i, "inf"));
export const fdFromInputs = (i: ToolInputs) => calculateFd(n(i, "p"), n(i, "r"), n(i, "t"), s(i, "c") as FdCompounding, n(i, "inf"));
export const ppfFromInputs = (i: ToolInputs) => calculatePpf(n(i, "a"), n(i, "r"), n(i, "y"), n(i, "inf"));

function growthChart(r: GrowthResult, inf: number, investedLabel = "Invested"): CardChart {
    const series: ChartSeries[] = [
        { label: "Value", color: CHART_COLORS.primary, values: r.series.map((p) => p.value) },
        { label: investedLabel, color: CHART_COLORS.storm, values: r.series.map((p) => p.invested) },
    ];
    if (inf > 0) series.push({ label: `In today's money (${formatPercent(inf)} inflation)`, color: CHART_COLORS.mid, values: r.series.map((p) => p.real), dashed: true });
    return { kind: "area", title: "Growth over time", xLabels: r.series.map((p) => p.label), series };
}

function growthRows(r: GrowthResult, inf: number, symbol: string, rate: number): CardSummary["rows"] {
    return [
        { label: "Invested", value: formatINRCompact(r.invested, { symbol }) },
        { label: "Est. returns", value: formatINRCompact(r.returns, { symbol }) },
        inf > 0 ? { label: "In today's money", value: formatINRCompact(r.realMaturity, { symbol }) } : { label: "Rate", value: formatPercent(rate, 2) },
    ];
}

// ── Round 2: payroll ───────────────────────────────────────────────────
export const SALARY_FIELDS = [
    { type: "number", key: "c", min: 100_000, max: 100_000_000, step: 10_000, default: 1_200_000 },
    { type: "number", key: "b", min: 30, max: 70, step: 1, default: 50 },
    { type: "enum", key: "pf", options: ["capped", "full", "none"], default: "capped" },
    { type: "enum", key: "g", options: ["y", "n"], default: "y" },
    { type: "number", key: "pt", min: 0, max: 2_500, step: 100, default: 2_400 },
    { type: "enum", key: "rg", options: ["new", "old"], default: "new" },
] as const satisfies readonly FieldSpec[];

export const salaryFromInputs = (i: ToolInputs) =>
    calculateSalary({
        ctc: n(i, "c"),
        basicPct: n(i, "b"),
        pf: s(i, "pf") as PfMode,
        gratuityInCtc: s(i, "g") === "y",
        professionalTax: n(i, "pt"),
        regime: s(i, "rg") as "new" | "old",
    });

export const HRA_FIELDS = [
    { type: "number", key: "b", min: 0, max: 50_000_000, step: 1_000, default: 600_000 },
    { type: "number", key: "h", min: 0, max: 50_000_000, step: 1_000, default: 300_000 },
    { type: "number", key: "r", min: 0, max: 50_000_000, step: 1_000, default: 300_000 },
    { type: "enum", key: "m", options: ["y", "n"], default: "y" },
] as const satisfies readonly FieldSpec[];

export const hraFromInputs = (i: ToolInputs) => calculateHra(n(i, "b"), n(i, "h"), n(i, "r"), s(i, "m") === "y");

export const GRATUITY_FIELDS = [
    { type: "number", key: "s", min: 1_000, max: 10_000_000, step: 500, default: 50_000 },
    { type: "number", key: "y", min: 0, max: 50, step: 1, default: 10 },
    { type: "number", key: "mo", min: 0, max: 11, step: 1, default: 0 },
    { type: "enum", key: "cv", options: ["y", "n"], default: "y" },
] as const satisfies readonly FieldSpec[];

export const gratuityFromInputs = (i: ToolInputs) => calculateGratuity(n(i, "s"), n(i, "y"), n(i, "mo"), s(i, "cv") === "y");

// ── Round 2: business ──────────────────────────────────────────────────
export const TDS_NATURES = Object.keys(TDS_RULES) as TdsNature[];

export const TDS_FIELDS = [
    { type: "enum", key: "n", options: TDS_NATURES, default: "prof" },
    { type: "number", key: "a", min: 1, max: 1_000_000_000, step: 1, default: 75_000 },
    { type: "number", key: "t", min: 0, max: 1_000_000_000, step: 1, default: 75_000 },
    { type: "enum", key: "pan", options: ["y", "n"], default: "y" },
] as const satisfies readonly FieldSpec[];

export const tdsFromInputs = (i: ToolInputs) => calculateTds(s(i, "n") as TdsNature, n(i, "a"), n(i, "t"), s(i, "pan") === "y");

export const BREAK_EVEN_FIELDS = [
    { type: "number", key: "f", min: 0, max: 1_000_000_000, step: 1_000, default: 300_000 },
    { type: "number", key: "p", min: 1, max: 100_000_000, step: 1, default: 1_000 },
    { type: "number", key: "vc", min: 0, max: 100_000_000, step: 1, default: 600 },
    { type: "number", key: "u", min: 0, max: 100_000_000, step: 1, default: 1_000 },
] as const satisfies readonly FieldSpec[];

export const breakEvenFromInputs = (i: ToolInputs) => calculateBreakEven(n(i, "f"), n(i, "p"), n(i, "vc"), n(i, "u"));

export const DILUTION_FIELDS = [
    { type: "number", key: "pre", min: 100_000, max: 100_000_000_000, step: 100_000, default: 80_000_000 },
    { type: "number", key: "inv", min: 10_000, max: 100_000_000_000, step: 100_000, default: 20_000_000 },
    { type: "number", key: "own", min: 1, max: 100, step: 0.5, default: 100 },
    { type: "number", key: "esop", min: 0, max: 30, step: 0.5, default: 10 },
] as const satisfies readonly FieldSpec[];

export const dilutionFromInputs = (i: ToolInputs) => calculateDilution(n(i, "pre"), n(i, "inv"), n(i, "own"), n(i, "esop"));

// ── Round 3: tax planning ──────────────────────────────────────────────
const AGE_FIELD = { type: "enum", key: "ag", options: ["below60", "60to80", "above80"], default: "below60" } as const;
const REGIME_FIELD = { type: "enum", key: "rg", options: ["new", "old"], default: "new" } as const;

export const PRESUMPTIVE_FIELDS = [
    { type: "enum", key: "k", options: ["prof", "business"], default: "prof" },
    { type: "number", key: "t", min: 10_000, max: 30_000_000, step: 10_000, default: 3_000_000 },
    { type: "number", key: "dg", min: 0, max: 100, step: 1, default: 100 },
    REGIME_FIELD,
    AGE_FIELD,
] as const satisfies readonly FieldSpec[];

export const presumptiveFromInputs = (i: ToolInputs) =>
    calculatePresumptive(s(i, "k") === "business" ? "business" : "profession", n(i, "t"), n(i, "dg"), s(i, "rg") as "new" | "old", s(i, "ag") as AgeGroup);

export const ADVANCE_TAX_FIELDS = [
    { type: "number", key: "i", min: 0, max: 1_000_000_000, step: 10_000, default: 2_000_000 },
    { type: "enum", key: "sl", options: ["n", "y"], default: "n" },
    REGIME_FIELD,
    { type: "number", key: "td", min: 0, max: 100_000_000, step: 1_000, default: 50_000 },
    { type: "enum", key: "pr", options: ["n", "y"], default: "n" },
    { type: "enum", key: "sr", options: ["n", "y"], default: "n" },
] as const satisfies readonly FieldSpec[];

export const advanceTaxFromInputs = (i: ToolInputs) =>
    calculateAdvanceTax(n(i, "i"), s(i, "rg") as "new" | "old", s(i, "sl") === "y", n(i, "td"), s(i, "pr") === "y", s(i, "sr") === "y");

export const GST_LATE_FEE_FIELDS = [
    { type: "enum", key: "rt", options: ["3b", "1"], default: "3b" },
    { type: "enum", key: "nil", options: ["n", "y"], default: "n" },
    { type: "enum", key: "tov", options: ["s", "m", "l"], default: "s" },
    { type: "number", key: "d", min: 1, max: 1_500, step: 1, default: 15 },
    { type: "number", key: "tx", min: 0, max: 1_000_000_000, step: 100, default: 50_000 },
] as const satisfies readonly FieldSpec[];

export const gstLateFeeFromInputs = (i: ToolInputs) =>
    calculateGstLateFee(s(i, "rt") as "3b" | "1", s(i, "nil") === "y", s(i, "tov") as "s" | "m" | "l", n(i, "d"), n(i, "tx"));

export const CAPITAL_GAINS_FIELDS = [
    { type: "enum", key: "as", options: ["eq", "prop", "oth"], default: "eq" },
    { type: "number", key: "b", min: 0, max: 10_000_000_000, step: 1_000, default: 500_000 },
    { type: "number", key: "s", min: 0, max: 10_000_000_000, step: 1_000, default: 800_000 },
    { type: "number", key: "m", min: 1, max: 600, step: 1, default: 18 },
    { type: "enum", key: "sb", options: ["0", "5", "10", "15", "20", "25", "30"], default: "30" },
    { type: "number", key: "ex", min: 0, max: 125_000, step: 1_000, default: 125_000 },
    { type: "enum", key: "pre", options: ["y", "n"], default: "y" },
    { type: "number", key: "by", min: 2001, max: 2026, step: 1, default: 2015 },
] as const satisfies readonly FieldSpec[];

export const capitalGainsFromInputs = (i: ToolInputs) =>
    calculateCapitalGains(s(i, "as") as AssetType, n(i, "b"), n(i, "s"), n(i, "m"), Number(s(i, "sb")), n(i, "ex"), s(i, "pre") === "y", n(i, "by"));

// ── Round 3: planning ──────────────────────────────────────────────────
export const NPS_FIELDS = [
    { type: "number", key: "m", min: 500, max: 1_000_000, step: 500, default: 5_000 },
    { type: "number", key: "ag", min: 18, max: 70, step: 1, default: 30 },
    { type: "number", key: "ra", min: 60, max: 75, step: 1, default: 60 },
    { type: "number", key: "r", min: 1, max: 15, step: 0.1, default: 10 },
    { type: "number", key: "s", min: 0, max: 20, step: 1, default: 0 },
    { type: "number", key: "an", min: 20, max: 100, step: 5, default: 20 },
    { type: "number", key: "ar", min: 3, max: 10, step: 0.1, default: 6 },
    INFLATION_FIELD,
] as const satisfies readonly FieldSpec[];

export const npsFromInputs = (i: ToolInputs) =>
    calculateNps(n(i, "m"), n(i, "ag"), Math.max(n(i, "ra"), n(i, "ag") + 1), n(i, "r"), n(i, "s"), n(i, "an"), n(i, "ar"), n(i, "inf"));

export const RD_FIELDS = [
    { type: "number", key: "m", min: 100, max: 1_000_000, step: 100, default: 5_000 },
    { type: "number", key: "r", min: 1, max: 12, step: 0.05, default: 7 },
    { type: "number", key: "t", min: 6, max: 120, step: 3, default: 60 },
    INFLATION_FIELD,
] as const satisfies readonly FieldSpec[];

export const rdFromInputs = (i: ToolInputs) => calculateRd(n(i, "m"), n(i, "r"), n(i, "t"), n(i, "inf"));

export const CAGR_FIELDS = [
    { type: "enum", key: "md", options: ["cagr", "sip"], default: "cagr" },
    { type: "number", key: "sv", min: 1, max: 10_000_000_000, step: 1, default: 100_000 },
    { type: "number", key: "ev", min: 0, max: 100_000_000_000, step: 1, default: 250_000 },
    { type: "number", key: "y", min: 0.5, max: 50, step: 0.5, default: 5 },
    { type: "number", key: "m", min: 100, max: 10_000_000, step: 100, default: 10_000 },
    { type: "number", key: "n", min: 6, max: 600, step: 1, default: 60 },
    { type: "number", key: "cv", min: 0, max: 100_000_000_000, step: 1, default: 800_000 },
] as const satisfies readonly FieldSpec[];

export const cagrFromInputs = (i: ToolInputs) =>
    s(i, "md") === "sip" ? calculateSipXirr(n(i, "m"), n(i, "n"), n(i, "cv")) : calculateCagr(n(i, "sv"), n(i, "ev"), n(i, "y"));

export const STRUCTURE_FIELDS = [
    { type: "enum", key: "fo", options: ["1", "2"], default: "2" },
    { type: "enum", key: "fu", options: ["y", "n"], default: "y" },
    { type: "enum", key: "es", options: ["n", "y"], default: "n" },
    { type: "enum", key: "li", options: ["y", "n"], default: "y" },
    { type: "number", key: "pr", min: 0, max: 10_000_000_000, step: 10_000, default: 2_000_000 },
] as const satisfies readonly FieldSpec[];

export const structureFromInputs = (i: ToolInputs) =>
    compareStructures({ founders: s(i, "fo") as "1" | "2", funding: s(i, "fu") === "y", esops: s(i, "es") === "y", limitedLiability: s(i, "li") === "y", profit: n(i, "pr") });

// ── Registry of engines, keyed by tool slug ────────────────────────────
export const TOOL_ENGINES: Record<string, ToolEngine> = {
    "business-structure-calculator": {
        fields: STRUCTURE_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const ranked = structureFromInputs(i);
            const best = ranked[0];
            const runnerUp = ranked[1];
            return {
                headline: `Best fit: ${STRUCTURES[best.id].name} (${best.score}/100) for ${s(i, "fo") === "1" ? "a solo founder" : "2+ founders"}${s(i, "fu") === "y" ? " planning to raise funds" : ""}`,
                rows: [
                    { label: "Recommended", value: STRUCTURES[best.id].shortName },
                    { label: "Runner-up", value: `${STRUCTURES[runnerUp.id].shortName} (${runnerUp.score})` },
                    { label: `Tax on ${formatINRCompact(n(i, "pr"), { symbol })} profit`, value: formatINRCompact(best.tax, { symbol }) },
                ],
                chart: {
                    kind: "bars",
                    title: "Fit score out of 100",
                    bars: ranked.filter((r) => r.available).map((r, idx) => ({
                        label: STRUCTURES[r.id].shortName,
                        value: Math.max(r.score, 1),
                        color: idx === 0 ? CHART_COLORS.primary : CHART_COLORS.mid,
                        caption: r.available ? String(r.score) : "N/A",
                    })),
                },
            };
        },
    },
    "presumptive-tax-calculator": {
        fields: PRESUMPTIVE_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = presumptiveFromInputs(i);
            const who = s(i, "k") === "business" ? "business turnover" : "professional receipts";
            return {
                headline: r.eligible
                    ? `${formatINRCompact(n(i, "t"), { symbol })} ${who}: tax ${formatINR(r.tax, { symbol })} under presumptive scheme (${TAX_YEAR_LABEL})`
                    : `${formatINRCompact(n(i, "t"), { symbol })} ${who} is above the ${formatINRCompact(r.limit, { symbol })} presumptive limit`,
                rows: [
                    { label: "Deemed profit", value: `${formatINRCompact(r.income, { symbol })} (${formatPercent(r.profitRate)})` },
                    { label: "Income tax", value: formatINR(r.tax, { symbol }) },
                    { label: "Tax as % of receipts", value: formatPercent(r.effectiveRateOnTurnover, 2) },
                ],
                chart: {
                    kind: "bars",
                    title: "Receipts, deemed profit and tax",
                    bars: [
                        { label: "Receipts", value: n(i, "t"), color: CHART_COLORS.mid, caption: formatINRCompact(n(i, "t"), { symbol }) },
                        { label: "Deemed profit", value: r.income, color: CHART_COLORS.primary, caption: formatINRCompact(r.income, { symbol }) },
                        { label: "Tax", value: r.tax, color: CHART_COLORS.storm, caption: formatINRCompact(r.tax, { symbol }) },
                    ],
                },
            };
        },
    },
    "advance-tax-calculator": {
        fields: ADVANCE_TAX_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = advanceTaxFromInputs(i);
            const first = r.schedule[0];
            return {
                headline: r.liable
                    ? `Advance tax of ${formatINR(r.netTax, { symbol })} due for ${TAX_YEAR_LABEL}: first instalment ${formatINR(first.amount, { symbol })} by ${first.due}`
                    : `No advance tax due on ${formatINRCompact(n(i, "i"), { symbol })} income for ${TAX_YEAR_LABEL}`,
                rows: [
                    { label: "Total tax", value: formatINR(r.totalTax, { symbol }) },
                    { label: "Advance tax due", value: formatINR(r.netTax, { symbol }) },
                    { label: "Interest if unpaid", value: formatINR(r.interest234B + r.interest234C, { symbol }) },
                ],
                chart: {
                    kind: "bars",
                    title: "Pay by each due date",
                    bars: r.schedule.map((sch) => ({
                        label: sch.due.replace("September", "Sept").replace("December", "Dec"),
                        value: Math.max(sch.amount, 1),
                        color: CHART_COLORS.primary,
                        caption: formatINRCompact(sch.amount, { symbol }),
                    })),
                },
            };
        },
    },
    "gst-late-fee-calculator": {
        fields: GST_LATE_FEE_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = gstLateFeeFromInputs(i);
            const ret = s(i, "rt") === "3b" ? "GSTR-3B" : "GSTR-1";
            return {
                headline: `${ret} filed ${n(i, "d")} days late: ${formatINR(r.total, { symbol })} in late fee${r.interest > 0 ? " and interest" : ""}`,
                rows: [
                    { label: r.capped ? "Late fee (capped)" : "Late fee", value: formatINR(r.lateFee, { symbol }) },
                    { label: "Interest at 18%", value: formatINR(r.interest, { symbol }) },
                    { label: "Total payable", value: formatINR(r.total, { symbol }) },
                ],
                chart: {
                    kind: "donut",
                    title: "What you pay",
                    segments: [
                        { label: "Late fee (CGST)", value: r.cgstFee, color: CHART_COLORS.primary },
                        { label: "Late fee (SGST)", value: r.sgstFee, color: CHART_COLORS.storm },
                        { label: "Interest", value: r.interest, color: CHART_COLORS.mid },
                    ].filter((seg) => seg.value > 0),
                },
            };
        },
    },
    "capital-gains-tax-calculator": {
        fields: CAPITAL_GAINS_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = capitalGainsFromInputs(i);
            const asset = { eq: "shares / equity funds", prop: "property", oth: "this asset" }[s(i, "as") as AssetType];
            const segments =
                r.gain > 0
                    ? [
                          { label: "Cost", value: n(i, "b"), color: CHART_COLORS.mid },
                          { label: "Gain after tax", value: r.gain - r.tax, color: CHART_COLORS.primary },
                          { label: "Tax", value: r.tax, color: CHART_COLORS.storm },
                      ]
                    : [
                          { label: "Sale value", value: n(i, "s"), color: CHART_COLORS.mid },
                          { label: "Loss", value: -r.gain, color: CHART_COLORS.storm },
                      ];
            return {
                headline:
                    r.gain > 0
                        ? `${formatINRCompact(r.gain, { symbol })} ${r.longTerm ? "long-term" : "short-term"} gain on ${asset}: tax ${formatINR(r.tax, { symbol })}`
                        : `Capital loss of ${formatINRCompact(-r.gain, { symbol })} on ${asset}: no tax, loss can be carried forward`,
                rows: [
                    { label: "Capital gain", value: formatINRCompact(r.gain, { symbol }) },
                    { label: "Tax rule", value: r.rateLabel.replace("₹", symbol.trim() === "Rs." ? "Rs. " : "₹") },
                    { label: "Tax payable", value: formatINR(r.tax, { symbol }) },
                ],
                chart: { kind: "donut", title: "Sale value split", segments: segments.filter((seg) => seg.value > 0) },
            };
        },
    },
    "nps-calculator": {
        fields: NPS_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = npsFromInputs(i);
            const series: ChartSeries[] = [
                { label: "Corpus", color: CHART_COLORS.primary, values: r.series.map((p) => p.value) },
                { label: "Invested", color: CHART_COLORS.storm, values: r.series.map((p) => p.invested) },
            ];
            if (n(i, "inf") > 0) series.push({ label: "In today's money", color: CHART_COLORS.mid, values: r.series.map((p) => p.real), dashed: true });
            return {
                headline: `${formatINR(n(i, "m"), { symbol })}/month in NPS from age ${n(i, "ag")} builds ${formatINRCompact(r.corpus, { symbol })} and ${formatINR(r.monthlyPension, { symbol })}/month pension`,
                rows: [
                    { label: "Corpus at retirement", value: formatINRCompact(r.corpus, { symbol }) },
                    { label: "Lump sum", value: formatINRCompact(r.lumpSum, { symbol }) },
                    { label: "Monthly pension", value: formatINR(r.monthlyPension, { symbol }) },
                ],
                chart: { kind: "area", title: "Corpus growth by age", xLabels: r.series.map((p) => p.label), series },
            };
        },
    },
    "rd-calculator": {
        fields: RD_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = rdFromInputs(i);
            return {
                headline: `${formatINR(n(i, "m"), { symbol })}/month RD at ${formatPercent(n(i, "r"), 2)} for ${formatTenure(n(i, "t"))} matures to ${formatINRCompact(r.maturity, { symbol })}`,
                rows: growthRows(r, n(i, "inf"), symbol, n(i, "r")),
                chart: growthChart(r, n(i, "inf"), "Deposited"),
            };
        },
    },
    "cagr-calculator": {
        fields: CAGR_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = cagrFromInputs(i);
            const sip = s(i, "md") === "sip";
            return {
                headline: sip
                    ? `SIP of ${formatINR(n(i, "m"), { symbol })}/month for ${formatTenure(n(i, "n"))} now worth ${formatINRCompact(r.finalValue, { symbol })}: XIRR ${formatPercent(r.ratePct, 2)}`
                    : `${formatINRCompact(n(i, "sv"), { symbol })} to ${formatINRCompact(n(i, "ev"), { symbol })} in ${n(i, "y")} years is a CAGR of ${formatPercent(r.ratePct, 2)}`,
                rows: [
                    { label: sip ? "XIRR (annualised)" : "CAGR", value: formatPercent(r.ratePct, 2) },
                    { label: "Absolute return", value: formatPercent(r.absolutePct) },
                    { label: "Total gain", value: formatINRCompact(r.gain, { symbol }) },
                ],
                chart: {
                    kind: "area",
                    title: sip ? "Investment growth at this XIRR" : "Growth at this CAGR",
                    xLabels: r.series.map((p) => p.label),
                    series: [
                        { label: "Value", color: CHART_COLORS.primary, values: r.series.map((p) => p.value) },
                        { label: "Invested", color: CHART_COLORS.storm, values: r.series.map((p) => p.invested) },
                    ],
                },
            };
        },
    },
    "salary-calculator": {
        fields: SALARY_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = salaryFromInputs(i);
            return {
                headline: `${formatINRCompact(n(i, "c"), { symbol })} CTC means about ${formatINR(r.inHandMonthly, { symbol })}/month in hand (${s(i, "rg")} regime, ${TAX_YEAR_LABEL})`,
                rows: [
                    { label: "In-hand / month", value: formatINR(r.inHandMonthly, { symbol }) },
                    { label: "Income tax / year", value: formatINR(r.incomeTax, { symbol }) },
                    { label: "PF (you + employer)", value: formatINRCompact(r.employeePf + r.employerPf, { symbol }) },
                ],
                chart: {
                    kind: "donut",
                    title: "Where your CTC goes",
                    segments: [
                        { label: "In-hand", value: r.inHandAnnual, color: CHART_COLORS.primary },
                        { label: "Income tax", value: r.incomeTax, color: CHART_COLORS.storm },
                        { label: "PF", value: r.employeePf + r.employerPf, color: CHART_COLORS.mid },
                        { label: "Gratuity + PT", value: r.gratuity + r.professionalTax, color: CHART_COLORS.soft },
                    ].filter((seg) => seg.value > 0),
                },
            };
        },
    },
    "lumpsum-calculator": {
        fields: LUMPSUM_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = lumpsumFromInputs(i);
            return {
                headline: `${formatINRCompact(n(i, "p"), { symbol })} invested once for ${n(i, "y")} years at ${formatPercent(n(i, "r"))} grows to ${formatINRCompact(r.maturity, { symbol })}`,
                rows: growthRows(r, n(i, "inf"), symbol, n(i, "r")),
                chart: growthChart(r, n(i, "inf")),
            };
        },
    },
    "fd-calculator": {
        fields: FD_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = fdFromInputs(i);
            return {
                headline: `FD of ${formatINRCompact(n(i, "p"), { symbol })} at ${formatPercent(n(i, "r"), 2)} for ${formatTenure(n(i, "t"))} matures to ${formatINRCompact(r.maturity, { symbol })}`,
                rows: growthRows(r, n(i, "inf"), symbol, n(i, "r")),
                chart: growthChart(r, n(i, "inf"), "Deposit"),
            };
        },
    },
    "ppf-calculator": {
        fields: PPF_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = ppfFromInputs(i);
            return {
                headline: `${formatINR(n(i, "a"), { symbol })} a year in PPF for ${n(i, "y")} years grows to ${formatINRCompact(r.maturity, { symbol })}, tax free`,
                rows: growthRows(r, n(i, "inf"), symbol, n(i, "r")),
                chart: growthChart(r, n(i, "inf")),
            };
        },
    },
    "hra-calculator": {
        fields: HRA_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = hraFromInputs(i);
            const color = (key: typeof r.binding) => (r.binding === key ? CHART_COLORS.primary : CHART_COLORS.mid);
            return {
                headline: `${formatINR(r.exempt, { symbol })} of ${formatINR(n(i, "h"), { symbol })} HRA is tax free (old regime, ${TAX_YEAR_LABEL})`,
                rows: [
                    { label: "HRA exempt", value: formatINR(r.exempt, { symbol }) },
                    { label: "HRA taxable", value: formatINR(r.taxable, { symbol }) },
                    { label: "City", value: s(i, "m") === "y" ? "Metro (50%)" : "Non-metro (40%)" },
                ],
                chart: {
                    kind: "bars",
                    title: "Exemption is the lowest of",
                    bars: [
                        { label: "HRA received", value: r.limits.actualHra, color: color("actualHra"), caption: formatINRCompact(r.limits.actualHra, { symbol }) },
                        { label: "Rent − 10% basic", value: r.limits.rentMinusTenPct, color: color("rentMinusTenPct"), caption: formatINRCompact(r.limits.rentMinusTenPct, { symbol }) },
                        { label: s(i, "m") === "y" ? "50% of basic" : "40% of basic", value: r.limits.pctOfBasic, color: color("pctOfBasic"), caption: formatINRCompact(r.limits.pctOfBasic, { symbol }) },
                    ],
                },
            };
        },
    },
    "gratuity-calculator": {
        fields: GRATUITY_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = gratuityFromInputs(i);
            const tenure = formatTenure(n(i, "y") * 12 + n(i, "mo"));
            return {
                headline: r.eligible
                    ? `${tenure} of service on ${formatINR(n(i, "s"), { symbol })}/month basic earns ${formatINRCompact(r.gratuity, { symbol })} gratuity`
                    : `${tenure} of service: not yet eligible for gratuity (5 years needed)`,
                rows: [
                    { label: "Gratuity", value: formatINRCompact(r.eligible ? r.gratuity : 0, { symbol }) },
                    { label: "Tax free", value: formatINRCompact(r.eligible ? r.taxFree : 0, { symbol }) },
                    { label: "Years counted", value: String(r.countedYears) },
                ],
                chart: {
                    kind: "area",
                    title: "Gratuity by years of service",
                    xLabels: r.series.map((p) => p.label),
                    series: [{ label: "Gratuity", color: CHART_COLORS.primary, values: r.series.map((p) => p.value) }],
                },
            };
        },
    },
    "tds-calculator": {
        fields: TDS_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = tdsFromInputs(i);
            const rule = TDS_RULES[s(i, "n") as TdsNature];
            return {
                headline: r.applicable
                    ? `TDS on ${formatINR(n(i, "a"), { symbol })} ${rule.label.toLowerCase()}: ${formatINR(r.tds, { symbol })} at ${formatPercent(r.rate)} (${r.section})`
                    : `No TDS on ${formatINR(n(i, "a"), { symbol })} ${rule.label.toLowerCase()} yet: below the threshold`,
                rows: [
                    { label: "TDS to deduct", value: formatINR(r.tds, { symbol }) },
                    { label: "Pay to vendor", value: formatINR(r.netPayable, { symbol }) },
                    { label: "Rate", value: formatPercent(r.rate) },
                ],
                chart: {
                    kind: "donut",
                    title: "Payment split",
                    segments: [
                        { label: "Paid to vendor", value: r.netPayable, color: CHART_COLORS.primary },
                        { label: "TDS to government", value: r.tds, color: CHART_COLORS.mid },
                    ],
                },
            };
        },
    },
    "break-even-calculator": {
        fields: BREAK_EVEN_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = breakEvenFromInputs(i);
            return {
                headline: r.possible
                    ? `Break even at ${r.units.toLocaleString("en-IN")} units (${formatINRCompact(r.revenue, { symbol })} revenue) a month`
                    : "No break-even: price must be higher than variable cost per unit",
                rows: [
                    { label: "Break-even units", value: r.possible ? r.units.toLocaleString("en-IN") : "N/A" },
                    { label: "Contribution margin", value: formatPercent(r.contributionMarginPct) },
                    { label: "Profit at expected sales", value: formatINRCompact(r.expectedProfit, { symbol }) },
                ],
                chart: {
                    kind: "area",
                    title: "Revenue vs total cost",
                    xLabels: r.series.map((p) => p.label),
                    series: [
                        { label: "Revenue", color: CHART_COLORS.primary, values: r.series.map((p) => p.revenue) },
                        { label: "Total cost", color: CHART_COLORS.storm, values: r.series.map((p) => p.cost) },
                    ],
                },
            };
        },
    },
    "equity-dilution-calculator": {
        fields: DILUTION_FIELDS,
        cardSummary: (i, symbol = "₹") => {
            const r = dilutionFromInputs(i);
            return {
                headline: `Raising ${formatINRCompact(n(i, "inv"), { symbol })} at ${formatINRCompact(n(i, "pre"), { symbol })} pre-money leaves founders with ${formatPercent(r.foundersPct)}`,
                rows: [
                    { label: "Founders after round", value: formatPercent(r.foundersPct) },
                    { label: "Investor stake", value: formatPercent(r.investorPct) },
                    { label: "Post-money value", value: formatINRCompact(r.postMoney, { symbol }) },
                ],
                chart: {
                    kind: "donut",
                    title: "Cap table after the round",
                    valueFormat: "percent",
                    segments: [
                        { label: "Founders", value: r.foundersPct, color: CHART_COLORS.primary },
                        { label: "New investor", value: r.investorPct, color: CHART_COLORS.storm },
                        { label: "ESOP pool", value: r.esopPct, color: CHART_COLORS.mid },
                        { label: "Other shareholders", value: r.othersPct, color: CHART_COLORS.soft },
                    ].filter((seg) => seg.value > 0.001),
                },
            };
        },
    },
    "sip-calculator": {
        fields: SIP_FIELDS,
        cardSummary: (inputs, symbol = "₹") => {
            const r = sipFromInputs(inputs);
            const inf = n(inputs, "inf");
            const series: ChartSeries[] = [
                { label: "Value", color: CHART_COLORS.primary, values: r.series.map((p) => p.value) },
                { label: "Invested", color: CHART_COLORS.storm, values: r.series.map((p) => p.invested) },
            ];
            if (inf > 0) series.push({ label: `In today's money (${formatPercent(inf)} inflation)`, color: CHART_COLORS.mid, values: r.series.map((p) => p.real), dashed: true });
            return {
                headline: `${formatINR(n(inputs, "a"), { symbol })}/month for ${n(inputs, "y")} years grows to ${formatINRCompact(r.maturity, { symbol })}`,
                rows: [
                    { label: "Invested", value: formatINRCompact(r.invested, { symbol }) },
                    { label: "Est. returns", value: formatINRCompact(r.returns, { symbol }) },
                    inf > 0
                        ? { label: "In today's money", value: formatINRCompact(r.realMaturity, { symbol }) }
                        : { label: "Expected return", value: formatPercent(n(inputs, "r")) },
                ],
                chart: { kind: "area", title: "Growth over time", xLabels: r.series.map((p) => `Yr ${p.year}`), series },
            };
        },
    },
    "emi-calculator": {
        fields: EMI_FIELDS,
        cardSummary: (inputs, symbol = "₹") => loanCard("Loan", emiFromInputs(inputs), n(inputs, "r"), symbol),
    },
    "home-loan-emi-calculator": {
        fields: HOME_LOAN_FIELDS,
        cardSummary: (inputs, symbol = "₹") => {
            const r = homeLoanFromInputs(inputs);
            const extra = r.interestSaved > 0 ? [{ label: "Saved by prepaying", value: formatINRCompact(r.interestSaved, { symbol }) }] : [];
            return loanCard("Home loan", r, n(inputs, "r"), symbol, extra);
        },
    },
    "car-loan-emi-calculator": {
        fields: CAR_LOAN_FIELDS,
        cardSummary: (inputs, symbol = "₹") => loanCard("Car loan", carLoanFromInputs(inputs), n(inputs, "r"), symbol),
    },
    "gst-calculator": {
        fields: GST_FIELDS,
        cardSummary: (inputs, symbol = "₹") => {
            const r = gstFromInputs(inputs);
            const rate = s(inputs, "g");
            const incl = s(inputs, "m") === "incl";
            const money = (v: number) => formatINR(v, { decimals: true, symbol });
            const taxRows = s(inputs, "s") === "intra"
                ? [{ label: `CGST + SGST (${Number(rate) / 2}% each)`, value: `${money(r.cgst)} + ${money(r.sgst)}` }]
                : [{ label: `IGST (${rate}%)`, value: money(r.igst) }];
            const segments = s(inputs, "s") === "intra"
                ? [
                      { label: "Taxable value", value: r.base, color: CHART_COLORS.primary },
                      { label: "CGST", value: r.cgst, color: CHART_COLORS.mid },
                      { label: "SGST", value: r.sgst, color: CHART_COLORS.storm },
                  ]
                : [
                      { label: "Taxable value", value: r.base, color: CHART_COLORS.primary },
                      { label: "IGST", value: r.igst, color: CHART_COLORS.mid },
                  ];
            return {
                headline: incl
                    ? `${money(r.total)} incl. ${rate}% GST = ${money(r.base)} + ${money(r.gst)} GST`
                    : `${money(r.base)} + ${rate}% GST = ${money(r.total)}`,
                rows: [{ label: "Taxable value", value: money(r.base) }, ...taxRows, { label: "Total", value: money(r.total) }],
                chart: { kind: "donut", title: "Invoice breakup", segments },
            };
        },
    },
    "income-tax-calculator": {
        fields: INCOME_TAX_FIELDS,
        cardSummary: (inputs, symbol = "₹") => {
            const r = incomeTaxFromInputs(inputs);
            const income = formatINRCompact(n(inputs, "i"), { symbol });
            const headline =
                r.better === "same"
                    ? `On ${income} income, both regimes cost ${formatINR(r.newRegime.totalTax, { symbol })} (${TAX_YEAR_LABEL})`
                    : `On ${income} income, the ${r.better} regime saves ${formatINR(r.savings, { symbol })} (${TAX_YEAR_LABEL})`;
            const color = (regime: "new" | "old") => (r.better === regime || r.better === "same" ? CHART_COLORS.primary : CHART_COLORS.mid);
            return {
                headline,
                rows: [
                    { label: "New regime tax", value: formatINR(r.newRegime.totalTax, { symbol }) },
                    { label: "Old regime tax", value: formatINR(r.oldRegime.totalTax, { symbol }) },
                    { label: "Effective rate (best)", value: formatPercent(Math.min(r.newRegime.effectiveRate, r.oldRegime.effectiveRate)) },
                ],
                chart: {
                    kind: "bars",
                    title: "Total tax payable",
                    bars: [
                        { label: "New regime", value: r.newRegime.totalTax, color: color("new"), caption: formatINRCompact(r.newRegime.totalTax, { symbol }) },
                        { label: "Old regime", value: r.oldRegime.totalTax, color: color("old"), caption: formatINRCompact(r.oldRegime.totalTax, { symbol }) },
                    ],
                },
            };
        },
    },
};

export function getEngine(slug: string): ToolEngine | undefined {
    return TOOL_ENGINES[slug];
}
