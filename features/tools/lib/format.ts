// features/tools/lib/format.ts
//
// Indian-locale number formatting shared by the calculators, the result card
// image route (edge) and the share text. Pure: no React, no browser APIs.

const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export interface MoneyOptions {
    /** Show paise. Defaults to false (rounded rupees). */
    decimals?: boolean;
    /** Currency prefix. The OG card may swap this for "Rs." if a font lacks the glyph. */
    symbol?: string;
}

/** ₹12,34,567 */
export function formatINR(value: number, { decimals = false, symbol = "₹" }: MoneyOptions = {}): string {
    if (!Number.isFinite(value)) return `${symbol}0`;
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    return `${sign}${symbol}${decimals ? inr2.format(abs) : inr0.format(Math.round(abs))}`;
}

/** ₹23.23 Lakh / ₹1.25 Cr / ₹85,000 */
export function formatINRCompact(value: number, { symbol = "₹" }: Pick<MoneyOptions, "symbol"> = {}): string {
    if (!Number.isFinite(value)) return `${symbol}0`;
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (abs >= 1e7) return `${sign}${symbol}${trimZeros((abs / 1e7).toFixed(2))} Cr`;
    if (abs >= 1e5) return `${sign}${symbol}${trimZeros((abs / 1e5).toFixed(2))} Lakh`;
    return formatINR(value, { symbol });
}

/** 12,34,567 (no symbol) */
export function formatNumber(value: number): string {
    return Number.isFinite(value) ? inr0.format(Math.round(value)) : "0";
}

export function formatPercent(value: number, digits = 1): string {
    if (!Number.isFinite(value)) return "0%";
    return `${trimZeros(value.toFixed(digits))}%`;
}

/** "10 years", "1 year", "5 years 3 months" */
export function formatTenure(months: number): string {
    const m = Math.max(0, Math.round(months));
    const years = Math.floor(m / 12);
    const rest = m % 12;
    const parts: string[] = [];
    if (years) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    if (rest) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
    return parts.length ? parts.join(" ") : "0 months";
}

function trimZeros(s: string): string {
    return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}
