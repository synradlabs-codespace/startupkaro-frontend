// features/tools/lib/calculators/taxPlanning.ts
//
// Presumptive tax, advance tax, GST late fee and capital gains.

import {
    ADVANCE_TAX,
    CAPITAL_GAINS,
    CII,
    CII_CURRENT_YEAR,
    GST_LATE_FEE,
    HEALTH_EDUCATION_CESS,
    PRESUMPTIVE,
    type AgeGroup,
} from "@/features/tools/data/tax-rules";
import { newRegimeTax, oldRegimeTax, type IncomeTaxInput } from "./incomeTax";

function regimeTax(income: number, regime: "new" | "old", age: AgeGroup, salaried: boolean) {
    const input: IncomeTaxInput = {
        grossIncome: income,
        age,
        salaried,
        section80C: 0,
        section80D: 0,
        hraExemption: 0,
        homeLoanInterest: 0,
        otherDeductions: 0,
    };
    return regime === "new" ? newRegimeTax(input) : oldRegimeTax(input);
}

// ── Presumptive ─────────────────────────────────────────────────────────
export interface PresumptiveResult {
    eligible: boolean;
    limit: number;
    income: number;
    tax: number;
    effectiveRateOnTurnover: number;
    profitRate: number;
}

/** `digitalPct` = share of receipts received through banking / digital channels (0 to 100). */
export function calculatePresumptive(kind: "business" | "profession", turnover: number, digitalPct: number, regime: "new" | "old", age: AgeGroup): PresumptiveResult {
    const cashShare = Math.max(0, 1 - digitalPct / 100);
    const enhanced = cashShare <= PRESUMPTIVE.maxCashShareForEnhanced;
    const rules = kind === "business" ? PRESUMPTIVE.business : PRESUMPTIVE.profession;
    const limit = enhanced ? rules.enhancedLimit : rules.limit;
    const income =
        kind === "business"
            ? turnover * (digitalPct / 100) * PRESUMPTIVE.business.digitalRate + turnover * cashShare * PRESUMPTIVE.business.cashRate
            : turnover * PRESUMPTIVE.profession.rate;
    const tax = regimeTax(income, regime, age, false).totalTax;
    return {
        eligible: turnover <= limit,
        limit,
        income,
        tax,
        effectiveRateOnTurnover: turnover > 0 ? (tax / turnover) * 100 : 0,
        profitRate: turnover > 0 ? (income / turnover) * 100 : 0,
    };
}

// ── Advance tax ─────────────────────────────────────────────────────────
export interface AdvanceTaxResult {
    totalTax: number;
    netTax: number;
    liable: boolean;
    reason: string;
    schedule: { due: string; cumulative: number; amount: number }[];
    interest234C: number;
    interest234B: number;
}

export function calculateAdvanceTax(
    income: number,
    regime: "new" | "old",
    salaried: boolean,
    tdsTcs: number,
    presumptive: boolean,
    seniorNoBusiness: boolean
): AdvanceTaxResult {
    const totalTax = regimeTax(income, regime, seniorNoBusiness ? "60to80" : "below60", salaried).totalTax;
    const netTax = Math.max(0, totalTax - tdsTcs);
    let liable = netTax >= ADVANCE_TAX.threshold;
    let reason = liable ? `Tax after TDS is ₹10,000 or more, so advance tax applies.` : `Tax after TDS is below ₹10,000, so no advance tax is due.`;
    if (seniorNoBusiness) {
        liable = false;
        reason = "Resident senior citizens without business or professional income are exempt from advance tax.";
    }

    const schedule = presumptive
        ? [{ due: "15 March", cumulative: 1, amount: liable ? netTax : 0 }]
        : ADVANCE_TAX.instalments.map((inst, i) => {
              const prev = i === 0 ? 0 : ADVANCE_TAX.instalments[i - 1].cumulative;
              return { due: inst.due, cumulative: inst.cumulative, amount: liable ? Math.round(netTax * (inst.cumulative - prev)) : 0 };
          });

    // Interest if nothing is paid in advance: 3 months on each of the first three
    // cumulative instalments and 1 month on the last; 234B for April to July (filing by 31 July).
    const rate = ADVANCE_TAX.interestPerMonth;
    const interest234C = !liable
        ? 0
        : presumptive
          ? Math.round(netTax * rate)
          : Math.round(netTax * (0.15 * 3 + 0.45 * 3 + 0.75 * 3 + 1) * rate);
    const interest234B = liable ? Math.round(netTax * rate * 4) : 0;

    return { totalTax, netTax, liable, reason, schedule, interest234C, interest234B };
}

// ── GST late fee ────────────────────────────────────────────────────────
export interface GstLateFeeResult {
    lateFee: number;
    cgstFee: number;
    sgstFee: number;
    interest: number;
    total: number;
    capped: boolean;
    cap: number;
}

export function calculateGstLateFee(returnType: "3b" | "1", nil: boolean, slab: "s" | "m" | "l", daysLate: number, taxPaidLate: number): GstLateFeeResult {
    const perDay = nil ? GST_LATE_FEE.perDayNil : GST_LATE_FEE.perDay;
    const cap = nil ? GST_LATE_FEE.capNil : GST_LATE_FEE.caps[slab];
    const raw = perDay * daysLate;
    const lateFee = Math.min(raw, cap);
    // Interest applies only to tax paid late in cash through GSTR-3B.
    const interest = returnType === "3b" && !nil ? Math.round(taxPaidLate * GST_LATE_FEE.interestRate * (daysLate / 365)) : 0;
    return { lateFee, cgstFee: lateFee / 2, sgstFee: lateFee / 2, interest, total: lateFee + interest, capped: raw > cap, cap };
}

// ── Capital gains ───────────────────────────────────────────────────────
export type AssetType = "eq" | "prop" | "oth";

export interface CapitalGainsResult {
    gain: number;
    longTerm: boolean;
    taxableGain: number;
    rateLabel: string;
    tax: number;
    netProceeds: number;
    indexed?: { indexedCost: number; gain: number; tax: number; chosen: boolean };
    withoutIndexationTax?: number;
}

export function calculateCapitalGains(
    asset: AssetType,
    buy: number,
    sell: number,
    months: number,
    slabPct: number,
    exemptionLeft: number,
    boughtBeforeJuly2024: boolean,
    buyYear: number
): CapitalGainsResult {
    const gain = sell - buy;
    const cess = 1 + HEALTH_EDUCATION_CESS;
    const longTerm = months > (asset === "eq" ? CAPITAL_GAINS.equity.longTermMonths : CAPITAL_GAINS.other.longTermMonths);

    if (gain <= 0) {
        return { gain, longTerm, taxableGain: 0, rateLabel: "No tax on a loss", tax: 0, netProceeds: sell };
    }

    if (asset === "eq") {
        if (longTerm) {
            const taxableGain = Math.max(0, gain - exemptionLeft);
            const tax = Math.round(taxableGain * CAPITAL_GAINS.equity.ltcgRate * cess);
            return { gain, longTerm, taxableGain, rateLabel: "LTCG 12.5% above ₹1.25 lakh", tax, netProceeds: sell - tax };
        }
        const tax = Math.round(gain * CAPITAL_GAINS.equity.stcgRate * cess);
        return { gain, longTerm, taxableGain: gain, rateLabel: "STCG 20%", tax, netProceeds: sell - tax };
    }

    if (!longTerm) {
        const tax = Math.round(gain * (slabPct / 100) * cess);
        return { gain, longTerm, taxableGain: gain, rateLabel: `STCG at your ${slabPct}% slab`, tax, netProceeds: sell - tax };
    }

    const plainTax = Math.round(gain * CAPITAL_GAINS.other.ltcgRate * cess);
    if (asset === "prop" && boughtBeforeJuly2024) {
        const ciiBuy = CII[Math.max(2001, Math.min(CII_CURRENT_YEAR, buyYear))];
        const indexedCost = (buy * CII[CII_CURRENT_YEAR]) / ciiBuy;
        const indexedGain = Math.max(0, sell - indexedCost);
        const indexedTax = Math.round(indexedGain * CAPITAL_GAINS.indexedRate * cess);
        const chosen = indexedTax < plainTax;
        const tax = Math.min(indexedTax, plainTax);
        return {
            gain,
            longTerm,
            taxableGain: chosen ? indexedGain : gain,
            rateLabel: chosen ? "LTCG 20% with indexation (lower)" : "LTCG 12.5% without indexation (lower)",
            tax,
            netProceeds: sell - tax,
            indexed: { indexedCost, gain: indexedGain, tax: indexedTax, chosen },
            withoutIndexationTax: plainTax,
        };
    }
    return { gain, longTerm, taxableGain: gain, rateLabel: "LTCG 12.5%", tax: plainTax, netProceeds: sell - plainTax };
}
