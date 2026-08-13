const SEO_DASH_PATTERN = /[\u2014\u2013]|\u00e2\u20ac\u201d/g;

export function sanitizeSeoText(value: string): string {
    return value.replace(SEO_DASH_PATTERN, ",").replace(/\s+,/g, ",").replace(/,\s*/g, ", ").trim();
}
