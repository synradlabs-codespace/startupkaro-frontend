// features/tools/lib/calculators/savings.ts
//
// Lumpsum, fixed deposit and PPF growth. All return a yearly series with an
// inflation-adjusted ("real", today's money) value alongside the nominal one.

export interface GrowthPoint {
    label: string;
    invested: number;
    value: number;
    real: number;
}

export interface GrowthResult {
    invested: number;
    maturity: number;
    returns: number;
    realMaturity: number;
    series: GrowthPoint[];
}

const deflate = (value: number, years: number, inflationPct: number) => value / Math.pow(1 + inflationPct / 100, years);

/** One-time investment, compounded annually. */
export function calculateLumpsum(principal: number, annualRatePct: number, years: number, inflationPct = 0): GrowthResult {
    const series: GrowthPoint[] = [];
    for (let y = 1; y <= years; y++) {
        const value = principal * Math.pow(1 + annualRatePct / 100, y);
        series.push({ label: `Yr ${y}`, invested: principal, value, real: deflate(value, y, inflationPct) });
    }
    const maturity = principal * Math.pow(1 + annualRatePct / 100, years);
    return { invested: principal, maturity, returns: maturity - principal, realMaturity: deflate(maturity, years, inflationPct), series };
}

export type FdCompounding = "m" | "q" | "h" | "a";
const PERIODS: Record<FdCompounding, number> = { m: 12, q: 4, h: 2, a: 1 };

/**
 * Cumulative FD: A = P × (1 + r/n)^(n·t). `months` allows tenures like
 * 18 months. Series points are yearly, plus the final maturity point.
 */
export function calculateFd(principal: number, annualRatePct: number, months: number, compounding: FdCompounding, inflationPct = 0): GrowthResult & { effectiveYield: number } {
    const n = PERIODS[compounding];
    const r = annualRatePct / 100;
    const at = (m: number) => principal * Math.pow(1 + r / n, (n * m) / 12);
    const series: GrowthPoint[] = [];
    const step = months <= 24 ? 3 : 12;
    for (let m = step; m < months; m += step) {
        series.push({ label: step === 3 ? `M${m}` : `Yr ${m / 12}`, invested: principal, value: at(m), real: deflate(at(m), m / 12, inflationPct) });
    }
    const maturity = at(months);
    series.push({ label: step === 3 ? `M${months}` : `Yr ${(months / 12).toFixed(months % 12 ? 1 : 0)}`, invested: principal, value: maturity, real: deflate(maturity, months / 12, inflationPct) });
    return {
        invested: principal,
        maturity,
        returns: maturity - principal,
        realMaturity: deflate(maturity, months / 12, inflationPct),
        series,
        effectiveYield: (Math.pow(1 + r / n, n) - 1) * 100,
    };
}

/** PPF: yearly deposit at the start of each year, compounded annually. */
export function calculatePpf(yearly: number, annualRatePct: number, years: number, inflationPct = 0): GrowthResult {
    const r = annualRatePct / 100;
    let value = 0;
    const series: GrowthPoint[] = [];
    for (let y = 1; y <= years; y++) {
        value = (value + yearly) * (1 + r);
        series.push({ label: `Yr ${y}`, invested: yearly * y, value, real: deflate(value, y, inflationPct) });
    }
    const invested = yearly * years;
    return { invested, maturity: value, returns: value - invested, realMaturity: deflate(value, years, inflationPct), series };
}
