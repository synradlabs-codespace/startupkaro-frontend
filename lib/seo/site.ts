// lib/seo/site.ts
//
// Single source of truth for site-wide SEO constants. Pulled from real data
// already used elsewhere in the codebase (see features/marketing/components/MarketingFooter.tsx)
// so this file never invents facts about the business.

import type { Metadata } from "next";
import { STARTUPKARO_LOGO_SRC } from "@/lib/brand";
import { sanitizeSeoText } from "./text";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://startupkaro.in";
export const SITE_NAME = "StartupKaro";
export const SITE_LEGAL_NAME = "STARTUPKARO PRIVATE LIMITED";
export const SITE_LOCALE = "en_IN";
export const DEFAULT_TITLE = sanitizeSeoText("StartupKaro | Registration, Compliance, Tax and Tech Services in India");
export const DEFAULT_DESCRIPTION =
    sanitizeSeoText("StartupKaro helps Indian startups and SMEs with company registration, compliance, tax, accounting, legal support, websites, apps, dashboards, and growth services through CAs, CSs, lawyers, and software engineers.");

export const ORG = {
    email: "contact@startupkaro.in",
    phones: ["+91 789 00000 88", "+91 737 00000 88"],
    address: { locality: "Mohali", region: "Punjab", country: "IN" },
    socials: [
        "https://www.instagram.com/Startupkaro.india",
        "https://x.com/startupkaro24",
        "https://www.linkedin.com/company/startupkaroindia/",
    ],
    twitterHandle: "@startupkaro24",
    logo: STARTUPKARO_LOGO_SRC,
} as const;

/** Applied to pages that should never appear in search results (internal panels, auth screens). */
export const NOINDEX: Metadata = {
    robots: { index: false, follow: false, nocache: true },
};

/** Resolve a site-relative path to an absolute URL against SITE_URL. */
export function absoluteUrl(path: string): string {
    return new URL(path, SITE_URL).toString();
}
