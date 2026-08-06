"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

declare global {
    interface Window {
        posthog?: typeof posthog;
    }
}

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let initialized = false;

function initPostHog() {
    if (initialized || typeof window === "undefined" || !POSTHOG_KEY) return;
    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        // Nothing is captured until the visitor accepts the cookie banner.
        opt_out_capturing_by_default: true,
        capture_pageview: false,
        capture_pageleave: true,
    });
    // Exposing this on window is PostHog's own recommended practice for the
    // npm-import setup (vs. the snippet loader, which does this automatically)
    // — it's what enables the PostHog Toolbar and console-based debugging.
    window.posthog = posthog;
    initialized = true;
}

function PageviewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!initialized || posthog.has_opted_out_capturing()) return;
        const query = searchParams.toString();
        posthog.capture("$pageview", {
            $current_url: query ? `${window.location.origin}${pathname}?${query}` : `${window.location.origin}${pathname}`,
        });
    }, [pathname, searchParams]);

    return null;
}

/**
 * Marketing-site-only PostHog init + pageview capture.
 * Mount ONLY in app/(marketing)/layout.tsx — never in admin/employee/customer
 * layouts, so staff usage of those panels doesn't inflate visitor counts.
 * Capture stays opted-out until CookieConsentBanner calls posthog.opt_in_capturing().
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initPostHog();
    }, []);

    return (
        <>
            <Suspense fallback={null}>
                <PageviewTracker />
            </Suspense>
            {children}
        </>
    );
}
