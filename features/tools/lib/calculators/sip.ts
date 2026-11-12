// features/tools/lib/calculators/sip.ts
//
// SIP future value, assuming contributions at the start of each month
// (annuity due) and monthly compounding at annualRate/12, which is the
// convention used by most Indian AMC and broker calculators.

export interface SipYear {
    year: number;
    invested: number;
    value: number;
    /** `value` expressed in today's money, deflated by the inflation rate. */
    real: number;
}

export interface SipResult {
    invested: number;
    returns: number;
    maturity: number;
    /** Maturity value in today's money. */
    realMaturity: number;
    series: SipYear[];
}

/**
 * `stepUpPct` raises the monthly amount by this % every 12 months.
 * `inflationPct` deflates values back to today's purchasing power.
 */
export function calculateSip(monthly: number, annualRatePct: number, years: number, stepUpPct = 0, inflationPct = 0): SipResult {
    const i = annualRatePct / 12 / 100;
    const months = Math.round(years * 12);
    let value = 0;
    let invested = 0;
    let amount = monthly;
    const series: SipYear[] = [];
    const deflate = (v: number, y: number) => v / Math.pow(1 + inflationPct / 100, y);

    for (let m = 1; m <= months; m++) {
        value = (value + amount) * (1 + i);
        invested += amount;
        if (m % 12 === 0) {
            const year = m / 12;
            series.push({ year, invested, value, real: deflate(value, year) });
            amount = amount * (1 + stepUpPct / 100);
        }
    }

    return { invested, returns: value - invested, maturity: value, realMaturity: deflate(value, years), series };
}
