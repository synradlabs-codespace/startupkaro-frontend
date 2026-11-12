// features/tools/lib/calculators/emi.ts
//
// Reducing-balance loan maths shared by the EMI, Home Loan and Car Loan tools.

export function monthlyEmi(principal: number, annualRatePct: number, months: number): number {
    if (principal <= 0 || months <= 0) return 0;
    const r = annualRatePct / 12 / 100;
    if (r === 0) return principal / months;
    const f = Math.pow(1 + r, months);
    return (principal * r * f) / (f - 1);
}

export interface YearRow {
    year: number;
    principalPaid: number;
    interestPaid: number;
    prepaid: number;
    closingBalance: number;
}

export interface LoanResult {
    principal: number;
    emi: number;
    /** Scheduled tenure in months. */
    scheduledMonths: number;
    /** Actual months to close (shorter than scheduled when prepaying). */
    months: number;
    totalInterest: number;
    totalPayment: number;
    schedule: YearRow[];
    /** Interest saved vs. the same loan with no prepayment. */
    interestSaved: number;
    monthsSaved: number;
}

/**
 * Simulates the loan month by month. `annualPrepayment` (optional) is paid
 * at the end of every 12th month and reduces the outstanding principal, which
 * keeps the EMI fixed and shortens the tenure (the common Indian bank default).
 */
export function simulateLoan(principal: number, annualRatePct: number, months: number, annualPrepayment = 0): LoanResult {
    const emi = monthlyEmi(principal, annualRatePct, months);
    const r = annualRatePct / 12 / 100;
    let balance = principal;
    let totalInterest = 0;
    let month = 0;
    const schedule: YearRow[] = [];
    let row: YearRow = { year: 1, principalPaid: 0, interestPaid: 0, prepaid: 0, closingBalance: balance };

    while (balance > 0.005 && month < months) {
        month += 1;
        const interest = balance * r;
        const principalPart = Math.min(balance, emi - interest);
        balance -= principalPart;
        totalInterest += interest;
        row.principalPaid += principalPart;
        row.interestPaid += interest;

        if (annualPrepayment > 0 && month % 12 === 0 && balance > 0) {
            const prepay = Math.min(balance, annualPrepayment);
            balance -= prepay;
            row.prepaid += prepay;
        }

        if (month % 12 === 0 || balance <= 0.005 || month === months) {
            row.closingBalance = Math.max(0, balance);
            schedule.push(row);
            row = { year: row.year + 1, principalPaid: 0, interestPaid: 0, prepaid: 0, closingBalance: balance };
        }
    }

    const baseInterest = annualPrepayment > 0 ? emi * months - principal : totalInterest;
    return {
        principal,
        emi,
        scheduledMonths: months,
        months: month,
        totalInterest,
        totalPayment: principal + totalInterest,
        schedule,
        interestSaved: Math.max(0, baseInterest - totalInterest),
        monthsSaved: Math.max(0, months - month),
    };
}
