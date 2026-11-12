// features/tools/lib/calculators/business.ts
//
// TDS on common business payments, break-even analysis and equity dilution.

import { TDS_NO_PAN_RATE, TDS_RULES, type TdsNature } from "@/features/tools/data/tax-rules";

export interface TdsResult {
    applicable: boolean;
    rate: number;
    tds: number;
    netPayable: number;
    reason: string;
    section: string;
}

/**
 * `amount` is this payment (monthly rent for rent cases); `yearTotal` is the
 * total paid to the same payee this FY including this payment.
 */
export function calculateTds(nature: TdsNature, amount: number, yearTotal: number, hasPan: boolean): TdsResult {
    const rule = TDS_RULES[nature];
    const total = Math.max(amount, yearTotal);
    let applicable: boolean;
    let reason: string;

    if (rule.basis === "monthly") {
        applicable = amount > rule.threshold;
        reason = applicable ? `Rent is above ₹${rule.threshold.toLocaleString("en-IN")} for the month.` : `No TDS: rent is within ₹${rule.threshold.toLocaleString("en-IN")} for the month.`;
    } else if (rule.basis === "contract") {
        applicable = amount > (rule.singleThreshold ?? 0) || total > rule.threshold;
        reason = applicable
            ? amount > (rule.singleThreshold ?? 0)
                ? `This single payment is above ₹${(rule.singleThreshold ?? 0).toLocaleString("en-IN")}.`
                : `Payments this year are above ₹${rule.threshold.toLocaleString("en-IN")}.`
            : `No TDS: single payment within ₹${(rule.singleThreshold ?? 0).toLocaleString("en-IN")} and yearly total within ₹${rule.threshold.toLocaleString("en-IN")}.`;
    } else {
        applicable = total > rule.threshold;
        reason = applicable ? `Payments this year are above ₹${rule.threshold.toLocaleString("en-IN")}.` : `No TDS: payments this year are within ₹${rule.threshold.toLocaleString("en-IN")}.`;
    }

    const rate = applicable ? (hasPan ? rule.rate : Math.max(rule.rate, TDS_NO_PAN_RATE)) : 0;
    const tds = Math.round(amount * rate);
    return { applicable, rate: rate * 100, tds, netPayable: amount - tds, reason, section: rule.section };
}

export interface BreakEvenResult {
    possible: boolean;
    contribution: number;
    contributionMarginPct: number;
    units: number;
    revenue: number;
    expectedProfit: number;
    marginOfSafetyPct: number;
    series: { label: string; revenue: number; cost: number }[];
}

/** Break-even units = fixed costs ÷ (price − variable cost per unit). */
export function calculateBreakEven(fixed: number, price: number, variable: number, expectedUnits: number): BreakEvenResult {
    const contribution = price - variable;
    const possible = contribution > 0;
    const units = possible ? Math.ceil(fixed / contribution) : 0;
    const maxUnits = Math.max(10, possible ? Math.max(units * 2, expectedUnits) : expectedUnits || 100);
    const steps = 12;
    const series = Array.from({ length: steps + 1 }, (_, i) => {
        const q = Math.round((maxUnits * i) / steps);
        return { label: `${q.toLocaleString("en-IN")} units`, revenue: q * price, cost: fixed + q * variable };
    });
    return {
        possible,
        contribution,
        contributionMarginPct: price > 0 ? (contribution / price) * 100 : 0,
        units,
        revenue: units * price,
        expectedProfit: expectedUnits * contribution - fixed,
        marginOfSafetyPct: possible && expectedUnits > 0 ? ((expectedUnits - units) / expectedUnits) * 100 : 0,
        series,
    };
}

export interface DilutionResult {
    postMoney: number;
    investorPct: number;
    esopPct: number;
    foundersPct: number;
    othersPct: number;
    foundersBeforePct: number;
    founderStakeValue: number;
}

/**
 * One priced round. The ESOP pool is sized as a % of the post-money cap
 * table and carved out of existing holders (the common "option pool
 * shuffle"), so the investor's stake is not diluted by it.
 */
export function calculateDilution(preMoney: number, investment: number, foundersPct: number, esopPct: number): DilutionResult {
    const postMoney = preMoney + investment;
    const investorPct = postMoney > 0 ? (investment / postMoney) * 100 : 0;
    const remaining = Math.max(0, 100 - investorPct - esopPct);
    const founders = (foundersPct / 100) * remaining;
    return {
        postMoney,
        investorPct,
        esopPct,
        foundersPct: founders,
        othersPct: remaining - founders,
        foundersBeforePct: foundersPct,
        founderStakeValue: (founders / 100) * postMoney,
    };
}
