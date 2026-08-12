// lib/seo/metadata.ts
//
// Every page-level metadata export in the marketing/article routes goes
// through this one helper, so title/description/canonical/OG/Twitter tags
// can never drift out of sync with each other.

import type { Metadata } from "next";
import { DEFAULT_DESCRIPTION, ORG, SITE_NAME } from "./site";
import { ogImageUrl } from "./og";

export interface BuildMetadataOptions {
    /** Bare page title — the root layout's `%s | StartupKaro` template adds the suffix. */
    title: string;
    description?: string;
    /** Site-relative path, e.g. "/services/gst-registration". Used for canonical + og:url. */
    path: string;
    /**
     * Absolute URL to use for `alternates.canonical` instead of `path` — for the
     * rare case (e.g. a syndicated article) where this page is not the canonical
     * source. `og:url` still uses `path`, since the OG card is about this URL.
     */
    canonicalOverride?: string;
    /** Open Graph title override, if it should differ from `title`. */
    ogTitle?: string;
    /** Small uppercase eyebrow rendered on the generated OG image (e.g. "Article", "Careers"). */
    ogLabel?: string;
    /** Explicit OG/Twitter image. Defaults to the generated `/api/og` card for this title. */
    image?: { url: string; alt?: string };
    type?: "website" | "article";
    noIndex?: boolean;
    keywords?: string[];
}

export function buildMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    path,
    canonicalOverride,
    ogTitle,
    ogLabel,
    image,
    type = "website",
    noIndex = false,
    keywords,
}: BuildMetadataOptions): Metadata {
    const resolvedImage = image ?? { url: ogImageUrl(ogTitle ?? title, ogLabel), alt: `${title} — ${SITE_NAME}` };

    return {
        title,
        description,
        keywords,
        alternates: { canonical: canonicalOverride ?? path },
        robots: noIndex ? { index: false, follow: false } : undefined,
        openGraph: {
            type,
            url: path,
            siteName: SITE_NAME,
            title: ogTitle ?? title,
            description,
            locale: "en_IN",
            images: [{ url: resolvedImage.url, width: 1200, height: 630, alt: resolvedImage.alt ?? title }],
        },
        twitter: {
            card: "summary_large_image",
            site: ORG.twitterHandle,
            creator: ORG.twitterHandle,
            title: ogTitle ?? title,
            description,
            images: [resolvedImage.url],
        },
    };
}
