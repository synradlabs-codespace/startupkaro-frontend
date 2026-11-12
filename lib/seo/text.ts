const SEO_DASH_PATTERN = /\s*(?:[—–]|â€”)\s*/g;

/**
 * Replaces em/en dashes with ", " for SEO-facing text. Deliberately does not
 * touch existing commas, so digit-grouped numbers ("₹1,50,000", "10,000")
 * survive intact.
 */
export function sanitizeSeoText(value: string): string {
    return value.replace(SEO_DASH_PATTERN, ", ").replace(/\s+,/g, ",").replace(/,\s{2,}/g, ", ").trim();
}
