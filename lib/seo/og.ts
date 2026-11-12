// lib/seo/og.ts
//
// Builds URLs for the dynamic Open Graph image generators:
//   - app/api/og/route.tsx              → standard page card (ogImageUrl)
//   - app/api/og/tool/[slug]/route.tsx  → free-tool result card (toolCardUrl)
//
// IMPORTANT: bump OG_TEMPLATE_VERSION whenever the visual template in
// app/api/og/route.tsx changes, and TOOL_CARD_VERSION whenever the result card
// layout changes. WhatsApp/Facebook/LinkedIn cache the OG image per-URL
// aggressively (often for days); the version query param is the only way to
// force a fresh scrape without waiting it out. See docs/SEO_CAVEATS.md.
import { sanitizeSeoText } from "./text";

const OG_TEMPLATE_VERSION = 1;
const TOOL_CARD_VERSION = 3;

const MAX_TITLE_LENGTH = 120;
const MAX_LABEL_LENGTH = 24;

/**
 * Build a relative URL to the generated OG image for a given title.
 * `label` is an optional small uppercase eyebrow (e.g. "Article", "Careers", "Services").
 */
export function ogImageUrl(title: string, label?: string): string {
    const params = new URLSearchParams();
    params.set("title", sanitizeSeoText(title).slice(0, MAX_TITLE_LENGTH));
    if (label) params.set("label", sanitizeSeoText(label).slice(0, MAX_LABEL_LENGTH));
    params.set("v", String(OG_TEMPLATE_VERSION));
    return `/api/og?${params.toString()}`;
}

/**
 * Relative URL to the result card for a free tool. `query` is the tool's
 * serialised inputs (features/tools/lib/params.ts → serializeInputs).
 */
export function toolCardUrl(slug: string, query: string, format: "landscape" | "square" = "landscape"): string {
    const params = new URLSearchParams(query);
    if (format === "square") params.set("format", "square");
    // "ver", not "v": tool inputs use short keys and must never collide with the cache-buster.
    params.set("ver", String(TOOL_CARD_VERSION));
    return `/api/og/tool/${encodeURIComponent(slug)}?${params.toString()}`;
}
