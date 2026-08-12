// lib/seo/site.ts
//
// Single source of truth for site-wide SEO constants. Pulled from real data
// already used elsewhere in the codebase (see features/marketing/components/MarketingFooter.tsx)
// so this file never invents facts about the business.

import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://startupkaro.in";
export const SITE_NAME = "StartupKaro";
export const SITE_LEGAL_NAME = "STARTUPKARO PRIVATE LIMITED";
export const SITE_LOCALE = "en_IN";
export const DEFAULT_TITLE = "StartupKaro — Company Registration, Compliance & Tax Services in India";
export const DEFAULT_DESCRIPTION =
    "StartupKaro brings together Chartered Accountants, Company Secretaries, lawyers, compliance experts, and software engineers to help Indian startups and SMEs incorporate, stay compliant, protect their brand, and grow — with fixed-cost services and transparent pricing.";

export const ORG = {
    email: "contact@startupkaro.in",
    phones: ["+91 789 00000 88", "+91 737 00000 88"],
    address: { locality: "Mohali", region: "Punjab", country: "IN" },
    socials: ["https://www.instagram.com/Startupkaro.india", "https://x.com/startupkaro24"],
    twitterHandle: "@startupkaro24",
    logo: "/assets/startupkaro-logo-transparent.png",
} as const;

/** Applied to pages that should never appear in search results (internal panels, auth screens). */
export const NOINDEX: Metadata = {
    robots: { index: false, follow: false, nocache: true },
};

/** Resolve a site-relative path to an absolute URL against SITE_URL. */
export function absoluteUrl(path: string): string {
    return new URL(path, SITE_URL).toString();
}
