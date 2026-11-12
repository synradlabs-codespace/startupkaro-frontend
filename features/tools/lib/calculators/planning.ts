// features/tools/lib/calculators/planning.ts
//
// NPS, recurring deposit, CAGR / XIRR and business structure comparison.

import { COMPANY_TAX_RATE, FIRM_TAX, HEALTH_EDUCATION_CESS, NPS } from "@/features/tools/data/tax-rules";
import { calculateSip } from "./sip";
import { newRegimeTax } from "./incomeTax";
import type { GrowthPoint, GrowthResult } from "./savings";

const deflate = (value: number, years: number, inflationPct: number) => value / Math.pow(1 + inflationPct / 100, years);

// ── NPS ─────────────────────────────────────────────────────────────────
export interface NpsResult {
    years: number;
    invested: number;
    corpus: number;
    lumpSum: number;
    annuityCorpus: number;
    monthlyPension: number;
    realMonthlyPension: number;
    realCorpus: number;
    fullWithdrawalAllowed: boolean;
    series: GrowthPoint[];
}

export function calculateNps(
    monthly: number,
    age: number,
    retireAge: number,
    returnPct: number,
    stepUpPct: number,
    annuityPct: number,
    annuityRatePct: number,
    inflationPct: number
): NpsResult {
    const years = Math.max(1, retireAge - age);
    const sip = calculateSip(monthly, returnPct, years, stepUpPct, inflationPct);
    const corpus = sip.maturity;
    const fullWithdrawalAllowed = corpus <= NPS.fullWithdrawalLimit;
    const share = Math.max(NPS.minAnnuityPct, annuityPct) / 100;
    const annuityCorpus = corpus * share;
    const monthlyPension = (annuityCorpus * annuityRatePct) / 100 / 12;
    return {
        years,
        invested: sip.invested,
        corpus,
        lumpSum: corpus - annuityCorpus,
        annuityCorpus,
        monthlyPension,
        realMonthlyPension: deflate(monthlyPension, years, inflationPct),
        realCorpus: sip.realMaturity,
        fullWithdrawalAllowed,
        series: sip.series.map((p) => ({ label: `Age ${age + p.year}`, invested: p.invested, value: p.value, real: p.real })),
    };
}

// ── Recurring deposit ───────────────────────────────────────────────────
/**
 * Bank RD convention: each monthly instalment compounds quarterly for the
 * months it stays deposited. Value at month T = Σ R × (1 + r/4)^((T − k + 1) / 3).
 */
export function calculateRd(monthly: number, ratePct: number, months: number, inflationPct = 0): GrowthResult {
    const q = ratePct / 400;
    const valueAt = (t: number) => {
        let total = 0;
        for (let k = 1; k <= t; k++) total += monthly * Math.pow(1 + q, (t - k + 1) / 3);
        return total;
    };
    const series: GrowthPoint[] = [];
    const step = months <= 24 ? 3 : 12;
    for (let m = step; m < months; m += step) {
        const value = valueAt(m);
        series.push({ label: step === 3 ? `M${m}` : `Yr ${m / 12}`, invested: monthly * m, value, real: deflate(value, m / 12, inflationPct) });
    }
    const maturity = valueAt(months);
    series.push({ label: step === 3 ? `M${months}` : `Yr ${Number((months / 12).toFixed(1))}`, invested: monthly * months, value: maturity, real: deflate(maturity, months / 12, inflationPct) });
    const invested = monthly * months;
    return { invested, maturity, returns: maturity - invested, realMaturity: deflate(maturity, months / 12, inflationPct), series };
}

// ── CAGR / XIRR ─────────────────────────────────────────────────────────
export interface ReturnRateResult {
    ratePct: number;
    absolutePct: number;
    invested: number;
    finalValue: number;
    gain: number;
    series: GrowthPoint[];
}

export function calculateCagr(start: number, end: number, years: number): ReturnRateResult {
    const ratePct = start > 0 && years > 0 ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0;
    const whole = Math.max(1, Math.ceil(years));
    const series: GrowthPoint[] = Array.from({ length: whole + 1 }, (_, i) => {
        const t = Math.min(i, years);
        const value = start * Math.pow(1 + ratePct / 100, t);
        return { label: `Yr ${Number(t.toFixed(1))}`, invested: start, value, real: value };
    });
    return { ratePct, absolutePct: start > 0 ? ((end - start) / start) * 100 : 0, invested: start, finalValue: end, gain: end - start, series };
}

/**
 * XIRR for a regular monthly SIP: solve the monthly rate i where the future
 * value of the instalments (start of month) equals the current value, then
 * annualise as (1 + i)^12 − 1. Bisection keeps it stable for losses too.
 */
export function calculateSipXirr(monthly: number, months: number, currentValue: number): ReturnRateResult {
    const fv = (i: number) => {
        if (Math.abs(i) < 1e-9) return monthly * months;
        return monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    };
    let lo = -0.99 / 12;
    let hi = 1;
    for (let k = 0; k < 200; k++) {
        const mid = (lo + hi) / 2;
        if (fv(mid) > currentValue) hi = mid;
        else lo = mid;
    }
    const i = (lo + hi) / 2;
    const ratePct = (Math.pow(1 + i, 12) - 1) * 100;
    const invested = monthly * months;
    const sip = calculateSip(monthly, i * 12 * 100, months / 12);
    const series: GrowthPoint[] = sip.series.map((p) => ({ label: `Yr ${p.year}`, invested: p.invested, value: p.value, real: p.value }));
    return { ratePct, absolutePct: invested > 0 ? ((currentValue - invested) / invested) * 100 : 0, invested, finalValue: currentValue, gain: currentValue - invested, series };
}

// ── Business structure ──────────────────────────────────────────────────
export type StructureId = "pvt" | "llp" | "opc" | "prop" | "part";

export interface StructureFacts {
    id: StructureId;
    name: string;
    shortName: string;
    liability: string;
    members: string;
    compliance: string;
    audit: string;
    funding: string;
    esop: boolean;
    servicePath: string;
}

export const STRUCTURES: Record<StructureId, StructureFacts> = {
    pvt: {
        id: "pvt",
        name: "Private Limited Company",
        shortName: "Pvt Ltd",
        liability: "Limited to share capital",
        members: "2 to 200 shareholders, 2+ directors",
        compliance: "High: board meetings, annual ROC filings, statutory audit",
        audit: "Statutory audit every year",
        funding: "Best: equity, VC and angel funding, ESOPs",
        esop: true,
        servicePath: "/services/private-limited-company",
    },
    llp: {
        id: "llp",
        name: "Limited Liability Partnership",
        shortName: "LLP",
        liability: "Limited to agreed contribution",
        members: "2+ designated partners",
        compliance: "Medium: Form 8 and Form 11 every year",
        audit: "Only if turnover > ₹40 lakh or contribution > ₹25 lakh",
        funding: "Limited: no equity shares, hard for VCs",
        esop: false,
        servicePath: "/services/llp",
    },
    opc: {
        id: "opc",
        name: "One Person Company",
        shortName: "OPC",
        liability: "Limited to share capital",
        members: "1 shareholder, 1 nominee",
        compliance: "Medium to high: ROC filings and statutory audit",
        audit: "Statutory audit every year",
        funding: "Moderate: can convert to Pvt Ltd to raise equity",
        esop: false,
        servicePath: "/services/one-person-company",
    },
    prop: {
        id: "prop",
        name: "Sole Proprietorship",
        shortName: "Proprietor",
        liability: "Unlimited: personal assets at risk",
        members: "1 owner",
        compliance: "Low: owner's ITR, GST if applicable",
        audit: "Tax audit only above ₹1 crore turnover (₹10 crore if mostly digital)",
        funding: "Poor: loans only, no equity",
        esop: false,
        servicePath: "/services/proprietorship",
    },
    part: {
        id: "part",
        name: "Partnership Firm",
        shortName: "Partnership",
        liability: "Unlimited and joint for all partners",
        members: "2 to 50 partners",
        compliance: "Low: firm ITR, partnership deed",
        audit: "Tax audit only above ₹1 crore turnover (₹10 crore if mostly digital)",
        funding: "Poor: partners' capital and loans",
        esop: false,
        servicePath: "/services/partnership",
    },
};

export interface StructureInput {
    founders: "1" | "2";
    funding: boolean;
    esops: boolean;
    limitedLiability: boolean;
    profit: number;
}

export interface StructureScore {
    id: StructureId;
    score: number;
    available: boolean;
    tax: number;
    reasons: string[];
}

function structureTax(id: StructureId, profit: number): number {
    if (profit <= 0) return 0;
    if (id === "pvt" || id === "opc") return Math.round(profit * COMPANY_TAX_RATE);
    if (id === "llp" || id === "part") {
        const surcharge = profit > FIRM_TAX.surchargeAbove ? 1 + FIRM_TAX.surcharge : 1;
        return Math.round(profit * FIRM_TAX.rate * surcharge * (1 + HEALTH_EDUCATION_CESS));
    }
    return newRegimeTax({ grossIncome: profit, age: "below60", salaried: false, section80C: 0, section80D: 0, hraExemption: 0, homeLoanInterest: 0, otherDeductions: 0 }).totalTax;
}

const SIMPLICITY: Record<StructureId, number> = { prop: 25, part: 20, llp: 16, opc: 8, pvt: 5 };

/** Transparent rule-based score out of 100 for each structure. */
export function compareStructures(input: StructureInput): StructureScore[] {
    const taxes = (Object.keys(STRUCTURES) as StructureId[]).map((id) => ({ id, tax: structureTax(id, input.profit) }));
    const minTax = Math.min(...taxes.map((t) => t.tax));

    return taxes
        .map(({ id, tax }) => {
            const reasons: string[] = [];
            const solo = input.founders === "1";
            const available = solo ? id === "opc" || id === "prop" || id === "pvt" : id !== "opc" && id !== "prop";
            let score = SIMPLICITY[id];

            if (input.funding) {
                const add = { pvt: 40, opc: 12, llp: 5, prop: 0, part: 0 }[id];
                score += add;
                if (id === "pvt") reasons.push("Investors can buy shares, so it suits equity fundraising.");
                if (id === "prop" || id === "part") reasons.push("Cannot issue shares to investors.");
            } else {
                score += { pvt: 10, opc: 10, llp: 15, prop: 15, part: 12 }[id];
            }
            if (input.esops) {
                score += id === "pvt" ? 15 : 0;
                if (id === "pvt") reasons.push("Can offer ESOPs to employees.");
            }
            if (input.limitedLiability) {
                const limited = id === "pvt" || id === "opc" || id === "llp";
                score += limited ? 20 : 0;
                reasons.push(limited ? "Protects personal assets with limited liability." : "Owners are personally liable for business debts.");
            }
            const taxScore = tax > 0 ? Math.round((minTax / tax) * 15) : 15;
            score += taxScore;
            if (tax === minTax && input.profit > 0) reasons.push("Lowest tax at your expected profit.");
            if (SIMPLICITY[id] >= 20) reasons.push("Simplest and cheapest to run.");
            if (id === "pvt" && !input.funding) reasons.push("Highest compliance load if you don't plan to raise funds.");

            if (solo && id === "pvt") reasons.unshift("Needs a second shareholder and director.");
            if (!available) reasons.unshift(solo ? "Needs at least 2 founders." : "Only for a single founder.");

            return { id, score: available ? Math.min(100, score) : 0, available, tax, reasons };
        })
        .sort((a, b) => b.score - a.score);
}
