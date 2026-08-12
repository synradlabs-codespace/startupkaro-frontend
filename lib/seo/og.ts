// lib/seo/og.ts
//
// Builds URLs for the dynamic Open Graph image generator at app/api/og/route.tsx.
//
// IMPORTANT: bump OG_TEMPLATE_VERSION whenever the visual template in
// app/api/og/route.tsx changes. WhatsApp/Facebook/LinkedIn cache the OG image
// per-URL aggressively (often for days); the version query param is the only
// way to force a fresh scrape without waiting it out. See docs/SEO_CAVEATS.md.
const OG_TEMPLATE_VERSION = 1;

const MAX_TITLE_LENGTH = 120;
const MAX_LABEL_LENGTH = 24;

/**
 * Build a relative URL to the generated OG image for a given title.
 * `label` is an optional small uppercase eyebrow (e.g. "Article", "Careers", "Services").
 */
export function ogImageUrl(title: string, label?: string): string {
    const params = new URLSearchParams();
    params.set("title", title.slice(0, MAX_TITLE_LENGTH));
    if (label) params.set("label", label.slice(0, MAX_LABEL_LENGTH));
    params.set("v", String(OG_TEMPLATE_VERSION));
    return `/api/og?${params.toString()}`;
}
