// features/tools/lib/calculators/payroll.ts
//
// Salary (CTC → in-hand), HRA exemption and gratuity.

import { EPF, GRATUITY, HRA } from "@/features/tools/data/tax-rules";
import { newRegimeTax, oldRegimeTax } from "./incomeTax";

export type PfMode = "capped" | "full" | "none";

export interface SalaryInput {
    ctc: number;
    basicPct: number;
    pf: PfMode;
    gratuityInCtc: boolean;
    professionalTax: number;
    regime: "new" | "old";
}

export interface SalaryResult {
    basic: number;
    employerPf: number;
    employeePf: number;
    gratuity: number;
    gross: number;
    professionalTax: number;
    incomeTax: number;
    inHandAnnual: number;
    inHandMonthly: number;
}

/**
 * CTC = gross salary + employer PF + gratuity accrual (if included).
 * In-hand = gross − employee PF − professional tax − income tax.
 */
export function calculateSalary(input: SalaryInput): SalaryResult {
    const basic = (input.ctc * input.basicPct) / 100;
    const pfWage = input.pf === "capped" ? Math.min(basic, EPF.wageCeilingMonthly * 12) : basic;
    const pf = input.pf === "none" ? 0 : pfWage * EPF.rate;
    const gratuity = input.gratuityInCtc ? basic * GRATUITY.accrualRateOfBasic : 0;
    const gross = Math.max(0, input.ctc - pf - gratuity);

    const taxBase = { age: "below60" as const, salaried: true, section80D: 0, hraExemption: 0, homeLoanInterest: 0 };
    const incomeTax =
        input.regime === "new"
            ? newRegimeTax({ ...taxBase, grossIncome: gross, section80C: 0, otherDeductions: 0 }).totalTax
            : // Old regime: employee PF counts towards 80C; professional tax is deductible.
              oldRegimeTax({ ...taxBase, grossIncome: gross, section80C: pf, otherDeductions: input.professionalTax }).totalTax;

    const inHandAnnual = Math.max(0, gross - pf - input.professionalTax - incomeTax);
    return {
        basic,
        employerPf: pf,
        employeePf: pf,
        gratuity,
        gross,
        professionalTax: input.professionalTax,
        incomeTax,
        inHandAnnual,
        inHandMonthly: inHandAnnual / 12,
    };
}

export interface HraResult {
    exempt: number;
    taxable: number;
    limits: { actualHra: number; rentMinusTenPct: number; pctOfBasic: number };
    binding: "actualHra" | "rentMinusTenPct" | "pctOfBasic";
}

/** HRA exemption = least of (actual HRA, rent − 10% of basic+DA, 50%/40% of basic+DA). All annual. */
export function calculateHra(basicDa: number, hraReceived: number, rentPaid: number, metro: boolean): HraResult {
    const limits = {
        actualHra: hraReceived,
        rentMinusTenPct: Math.max(0, rentPaid - HRA.rentExcessOfBasic * basicDa),
        pctOfBasic: basicDa * (metro ? HRA.metroRate : HRA.nonMetroRate),
    };
    const entries = Object.entries(limits) as [HraResult["binding"], number][];
    const [binding, exempt] = entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min));
    return { exempt, taxable: Math.max(0, hraReceived - exempt), limits, binding };
}

export interface GratuityResult {
    eligible: boolean;
    countedYears: number;
    gratuity: number;
    taxFree: number;
    taxable: number;
    series: { label: string; value: number }[];
}

/**
 * Covered by the Payment of Gratuity Act / Code on Social Security:
 *   15 × last monthly (basic + DA) × years ÷ 26, with 6+ months rounding up.
 * Not covered: 15 × average monthly salary × completed years ÷ 30.
 */
export function calculateGratuity(monthlySalary: number, years: number, months: number, covered: boolean): GratuityResult {
    const countedYears = covered ? years + (months >= 6 ? 1 : 0) : years;
    const divisor = covered ? 26 : 30;
    const per = (y: number) => (15 * monthlySalary * y) / divisor;
    const gratuity = per(countedYears);
    // 5 years of continuous service; courts treat 4 years 240 days as 5 for covered employees.
    const eligible = years >= GRATUITY.minServiceYears || (covered && years === GRATUITY.minServiceYears - 1 && months >= 8);
    const taxFree = Math.min(gratuity, GRATUITY.taxFreeLimit);
    const series = Array.from({ length: Math.max(1, countedYears) }, (_, i) => ({ label: `Yr ${i + 1}`, value: per(i + 1) }));
    return { eligible, countedYears, gratuity, taxFree, taxable: Math.max(0, gratuity - GRATUITY.taxFreeLimit), series };
}
