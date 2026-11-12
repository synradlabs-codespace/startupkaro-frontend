// features/tools/lib/calculators/incomeTax.ts
//
// Individual income tax for resident individuals, old vs new regime.
// All constants come from features/tools/data/tax-rules.ts.

import { HEALTH_EDUCATION_CESS, NEW_REGIME, OLD_REGIME, type AgeGroup, type Slab } from "@/features/tools/data/tax-rules";

export interface IncomeTaxInput {
    grossIncome: number;
    age: AgeGroup;
    salaried: boolean;
    /** Old regime only */
    section80C: number;
    section80D: number;
    hraExemption: number;
    homeLoanInterest: number;
    otherDeductions: number;
}

export interface RegimeResult {
    taxableIncome: number;
    deductions: number;
    slabTax: number;
    rebate: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
    /** Slab-wise breakdown for the "how it's calculated" table. */
    slabs: { from: number; to: number; rate: number; tax: number }[];
}

export interface IncomeTaxResult {
    newRegime: RegimeResult;
    oldRegime: RegimeResult;
    better: "new" | "old" | "same";
    savings: number;
}

function slabTax(income: number, slabs: readonly Slab[], start = 0): { tax: number; rows: RegimeResult["slabs"] } {
    let tax = 0;
    let lower = start;
    const rows: RegimeResult["slabs"] = [];
    for (const slab of slabs) {
        if (income <= lower) break;
        const upper = Math.min(income, slab.upTo);
        const portion = upper - lower;
        const t = portion * slab.rate;
        rows.push({ from: lower, to: upper, rate: slab.rate, tax: t });
        tax += t;
        lower = slab.upTo;
    }
    return { tax, rows };
}

/**
 * Surcharge with marginal relief: tax + surcharge just above a threshold may
 * not exceed tax at the threshold plus the income above it.
 */
function surchargeWithRelief(
    income: number,
    tax: number,
    bands: readonly { above: number; rate: number }[],
    taxAt: (income: number) => number
): number {
    let applicable: { above: number; rate: number } | undefined;
    let previousRate = 0;
    for (const band of bands) {
        if (income > band.above) {
            previousRate = applicable?.rate ?? 0;
            applicable = band;
        }
    }
    if (!applicable) return 0;
    const surcharge = tax * applicable.rate;
    const thresholdTax = taxAt(applicable.above);
    const cap = thresholdTax * (1 + previousRate) + (income - applicable.above) - tax;
    return Math.max(0, Math.min(surcharge, cap));
}

function finish(taxable: number, deductions: number, slabResult: { tax: number; rows: RegimeResult["slabs"] }, rebate: number, surcharge: number, gross: number): RegimeResult {
    const afterRebate = Math.max(0, slabResult.tax - rebate);
    const cess = (afterRebate + surcharge) * HEALTH_EDUCATION_CESS;
    const totalTax = Math.round(afterRebate + surcharge + cess);
    return {
        taxableIncome: taxable,
        deductions,
        slabTax: slabResult.tax,
        rebate,
        surcharge,
        cess,
        totalTax,
        effectiveRate: gross > 0 ? (totalTax / gross) * 100 : 0,
        slabs: slabResult.rows,
    };
}

export function newRegimeTax(input: IncomeTaxInput): RegimeResult {
    const deductions = input.salaried ? NEW_REGIME.standardDeduction : 0;
    const taxable = Math.max(0, input.grossIncome - deductions);
    const base = slabTax(taxable, NEW_REGIME.slabs);

    let rebate = 0;
    if (taxable <= NEW_REGIME.rebateIncomeLimit) {
        rebate = Math.min(base.tax, NEW_REGIME.rebateMax);
    } else {
        // Marginal relief: tax can't exceed the income above ₹12L.
        const excess = taxable - NEW_REGIME.rebateIncomeLimit;
        if (base.tax > excess) rebate = base.tax - excess;
    }

    const taxBeforeSurcharge = base.tax - rebate;
    const surcharge = surchargeWithRelief(taxable, taxBeforeSurcharge, NEW_REGIME.surcharge, (i) => slabTax(i, NEW_REGIME.slabs).tax);
    return finish(taxable, deductions, base, rebate, surcharge, input.grossIncome);
}

function oldSlabs(age: AgeGroup): Slab[] {
    const exemption = OLD_REGIME.basicExemption[age];
    return [{ upTo: exemption, rate: 0 }, ...OLD_REGIME.bands.filter((b) => b.upTo > exemption)];
}

export function oldRegimeTax(input: IncomeTaxInput): RegimeResult {
    const { limits } = OLD_REGIME;
    const deductions =
        (input.salaried ? OLD_REGIME.standardDeduction : 0) +
        Math.min(input.section80C, limits.section80C) +
        Math.min(input.section80D, limits.section80D) +
        Math.max(0, input.hraExemption) +
        Math.min(input.homeLoanInterest, limits.homeLoanInterest) +
        Math.max(0, input.otherDeductions);
    const taxable = Math.max(0, input.grossIncome - deductions);
    const slabs = oldSlabs(input.age);
    const base = slabTax(taxable, slabs);
    const rebate = taxable <= OLD_REGIME.rebateIncomeLimit ? Math.min(base.tax, OLD_REGIME.rebateMax) : 0;
    const surcharge = surchargeWithRelief(taxable, base.tax - rebate, OLD_REGIME.surcharge, (i) => slabTax(i, slabs).tax);
    return finish(taxable, deductions, base, rebate, surcharge, input.grossIncome);
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
    const newRegime = newRegimeTax(input);
    const oldRegime = oldRegimeTax(input);
    const diff = oldRegime.totalTax - newRegime.totalTax;
    return {
        newRegime,
        oldRegime,
        better: diff > 0 ? "new" : diff < 0 ? "old" : "same",
        savings: Math.abs(diff),
    };
}
