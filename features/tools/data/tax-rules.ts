// features/tools/data/tax-rules.ts
//
// SINGLE SOURCE OF TRUTH for tax-year constants used by the free tools.
// Update this file (and bump TAX_RULES_AS_OF) after every Union Budget.
//
// FY 2026-27 (AY 2027-28) figures. Budget 2026 (1 Feb 2026) kept the slabs,
// the ₹12L rebate ceiling and the ₹75,000 standard deduction unchanged from
// FY 2025-26. The Income-tax Act, 2025 (effective 1 Apr 2026) renumbers
// sections (e.g. 80C → 123, 80D → 124) but does not change these rates; the
// tools keep the familiar old section names in copy because that is what
// people search for.

export const TAX_YEAR_LABEL = "FY 2026-27";
export const ASSESSMENT_YEAR_LABEL = "AY 2027-28";
export const TAX_RULES_AS_OF = "2026-11-12";

export interface Slab {
    /** Upper bound of this slab in ₹ (Infinity for the top slab). */
    upTo: number;
    /** Rate as a fraction, e.g. 0.05 */
    rate: number;
}

export const NEW_REGIME = {
    slabs: [
        { upTo: 400_000, rate: 0 },
        { upTo: 800_000, rate: 0.05 },
        { upTo: 1_200_000, rate: 0.1 },
        { upTo: 1_600_000, rate: 0.15 },
        { upTo: 2_000_000, rate: 0.2 },
        { upTo: 2_400_000, rate: 0.25 },
        { upTo: Infinity, rate: 0.3 },
    ] satisfies Slab[],
    standardDeduction: 75_000,
    /** Full rebate when total income ≤ this (resident individuals). Marginal relief above it. */
    rebateIncomeLimit: 1_200_000,
    rebateMax: 60_000,
    /** New regime caps surcharge at 25%. */
    surcharge: [
        { above: 5_000_000, rate: 0.1 },
        { above: 10_000_000, rate: 0.15 },
        { above: 20_000_000, rate: 0.25 },
    ],
} as const;

export type AgeGroup = "below60" | "60to80" | "above80";

export const OLD_REGIME = {
    basicExemption: { below60: 250_000, "60to80": 300_000, above80: 500_000 } satisfies Record<AgeGroup, number>,
    /** Rates above the basic exemption. */
    bands: [
        { upTo: 500_000, rate: 0.05 },
        { upTo: 1_000_000, rate: 0.2 },
        { upTo: Infinity, rate: 0.3 },
    ] satisfies Slab[],
    standardDeduction: 50_000,
    rebateIncomeLimit: 500_000,
    rebateMax: 12_500,
    surcharge: [
        { above: 5_000_000, rate: 0.1 },
        { above: 10_000_000, rate: 0.15 },
        { above: 20_000_000, rate: 0.25 },
        { above: 50_000_000, rate: 0.37 },
    ],
    limits: {
        section80C: 150_000,
        /** 80D: self/family + parents, both at the senior-citizen ceiling. */
        section80D: 100_000,
        /** Interest on self-occupied home loan, Section 24(b). */
        homeLoanInterest: 200_000,
    },
} as const;

export const HEALTH_EDUCATION_CESS = 0.04;

/** GST rate structure after the GST 2.0 rationalisation (effective 22 Sep 2025). */
export const GST_RATES = ["5", "18", "40", "3", "0.25"] as const;
export type GstRate = (typeof GST_RATES)[number];

// ── Payroll ────────────────────────────────────────────────────────────
/** EPF: 12% of basic, on a wage ceiling of ₹15,000/month unless the employer contributes on full basic. */
export const EPF = { rate: 0.12, wageCeilingMonthly: 15_000 } as const;

/** Gratuity accrual commonly built into CTC: 15 days (15/26 of monthly basic) per year, about 4.81% of annual basic. */
export const GRATUITY = {
    accrualRateOfBasic: 15 / 26 / 12,
    /** Lifetime tax-exempt limit for non-government employees. */
    taxFreeLimit: 2_000_000,
    /** Minimum continuous service for permanent employees (years). */
    minServiceYears: 5,
} as const;

// ── HRA (old regime only) ──────────────────────────────────────────────
/**
 * From FY 2026-27, Rule 279 of the Income-tax Rules, 2026 extends the 50% HRA
 * limit to eight cities (Bengaluru, Hyderabad, Pune and Ahmedabad were added).
 */
export const HRA_METRO_CITIES = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad", "Pune", "Ahmedabad"] as const;
export const HRA = { metroRate: 0.5, nonMetroRate: 0.4, rentExcessOfBasic: 0.1 } as const;

// ── Investments ────────────────────────────────────────────────────────
/** PPF rate for Oct to Dec 2026 (unchanged at 7.1% since April 2020). Reset quarterly by the government. */
export const PPF = { rate: 7.1, maxYearly: 150_000, minYearly: 500, lockInYears: 15 } as const;

// ── TDS (non-salary) ───────────────────────────────────────────────────
/**
 * Common non-salary TDS cases for FY 2026-27. Under the Income-tax Act, 2025
 * these sit in the section 393 table; the familiar old section numbers are
 * shown because that is what people search for. Without a valid PAN, TDS is
 * deducted at 20% (or the normal rate if higher).
 */
export type TdsNature = "prof" | "tech" | "cont_ind" | "cont_oth" | "comm" | "rent_bld" | "rent_pm";

export const TDS_RULES: Record<TdsNature, {
    label: string;
    section: string;
    rate: number;
    /** Threshold logic: "annual" aggregate in the FY, "monthly" rent per month, "contract" single + aggregate */
    basis: "annual" | "monthly" | "contract";
    threshold: number;
    singleThreshold?: number;
}> = {
    prof: { label: "Professional fees", section: "194J (393)", rate: 0.1, basis: "annual", threshold: 50_000 },
    tech: { label: "Technical services / royalty", section: "194J (393)", rate: 0.02, basis: "annual", threshold: 50_000 },
    cont_ind: { label: "Contractor (individual / HUF)", section: "194C (393)", rate: 0.01, basis: "contract", threshold: 100_000, singleThreshold: 30_000 },
    cont_oth: { label: "Contractor (company / firm)", section: "194C (393)", rate: 0.02, basis: "contract", threshold: 100_000, singleThreshold: 30_000 },
    comm: { label: "Commission / brokerage", section: "194H (393)", rate: 0.02, basis: "annual", threshold: 20_000 },
    rent_bld: { label: "Rent: land, building, furniture", section: "194I (393)", rate: 0.1, basis: "monthly", threshold: 50_000 },
    rent_pm: { label: "Rent: plant and machinery", section: "194I (393)", rate: 0.02, basis: "monthly", threshold: 50_000 },
};

export const TDS_NO_PAN_RATE = 0.2;

// ── Presumptive taxation (old 44AD / 44ADA, now section 58 of the 2025 Act) ──
export const PRESUMPTIVE = {
    business: { digitalRate: 0.06, cashRate: 0.08, limit: 20_000_000, enhancedLimit: 30_000_000 },
    profession: { rate: 0.5, limit: 5_000_000, enhancedLimit: 7_500_000 },
    /** Enhanced limits apply when cash receipts are at most 5% of total receipts. */
    maxCashShareForEnhanced: 0.05,
} as const;

// ── Advance tax ────────────────────────────────────────────────────────
export const ADVANCE_TAX = {
    /** Liable when tax after TDS/TCS is ₹10,000 or more. */
    threshold: 10_000,
    instalments: [
        { due: "15 June", cumulative: 0.15 },
        { due: "15 September", cumulative: 0.45 },
        { due: "15 December", cumulative: 0.75 },
        { due: "15 March", cumulative: 1 },
    ],
    /** 1% a month simple interest under the old 234B/234C provisions. */
    interestPerMonth: 0.01,
} as const;

// ── GST late fee and interest (GSTR-3B / GSTR-1) ───────────────────────
export const GST_LATE_FEE = {
    perDay: 50,
    perDayNil: 20,
    capNil: 500,
    /** Caps per return by aggregate turnover in the previous year (Notification 19/2021-CT). */
    caps: { s: 2_000, m: 5_000, l: 10_000 },
    interestRate: 0.18,
} as const;

// ── Capital gains (transfers on or after 23 July 2024) ─────────────────
export const CAPITAL_GAINS = {
    equity: { longTermMonths: 12, ltcgRate: 0.125, stcgRate: 0.2, ltcgExemption: 125_000 },
    other: { longTermMonths: 24, ltcgRate: 0.125 },
    /** Land/building bought before 23 July 2024 by resident individuals/HUFs: lower of 12.5% or 20% with indexation. */
    indexedRate: 0.2,
} as const;

/** Cost Inflation Index by financial year start (2001 = FY 2001-02). FY 2026-27 is 384 (CBDT Notification 85/2026). */
export const CII: Record<number, number> = {
    2001: 100, 2002: 105, 2003: 109, 2004: 113, 2005: 117, 2006: 122, 2007: 129, 2008: 137, 2009: 148,
    2010: 167, 2011: 184, 2012: 200, 2013: 220, 2014: 240, 2015: 254, 2016: 264, 2017: 272, 2018: 280,
    2019: 289, 2020: 301, 2021: 317, 2022: 331, 2023: 348, 2024: 363, 2025: 376, 2026: 384,
};
export const CII_CURRENT_YEAR = 2026;

// ── NPS (non-government subscribers, PFRDA exit rules amended Dec 2025) ──
export const NPS = {
    minAnnuityPct: 20,
    govtMinAnnuityPct: 40,
    /** Corpus up to this can be withdrawn fully. */
    fullWithdrawalLimit: 800_000,
    /** Share of corpus that is tax free when withdrawn as lump sum. */
    taxFreeLumpSumPct: 60,
} as const;

// ── Business structures ────────────────────────────────────────────────
/** Company tax under the concessional regime: 22% + 10% surcharge + 4% cess. */
export const COMPANY_TAX_RATE = 0.22 * 1.1 * 1.04;
/** Firms and LLPs: 30% + 4% cess, plus 12% surcharge above ₹1 crore. */
export const FIRM_TAX = { rate: 0.3, surchargeAbove: 10_000_000, surcharge: 0.12 } as const;
