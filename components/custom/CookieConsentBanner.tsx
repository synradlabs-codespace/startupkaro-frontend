"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "startupkaro-cookie-consent";

type ConsentChoice = "accepted" | "declined";

function readStoredChoice(): ConsentChoice | null {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
}

function subscribe(onStoreChange: () => void) {
    window.addEventListener("storage", onStoreChange);
    return () => window.removeEventListener("storage", onStoreChange);
}

// Assume "accepted" on the server so the banner isn't in the initial HTML for
// repeat visitors (the common case); useSyncExternalStore then reconciles
// against localStorage right after hydration without a mismatch warning.
function getServerSnapshot(): ConsentChoice {
    return "accepted";
}

/**
 * Gates PostHog capture behind explicit consent. Mount only in
 * app/(marketing)/layout.tsx, alongside PostHogProvider — never in the
 * admin/employee/customer panels.
 */
export function CookieConsentBanner() {
    const storedChoice = useSyncExternalStore(subscribe, readStoredChoice, getServerSnapshot);

    const choose = (choice: ConsentChoice) => {
        window.localStorage.setItem(CONSENT_KEY, choice);
        // localStorage writes from the same tab don't fire the "storage" event,
        // so nudge useSyncExternalStore to re-read by dispatching it manually.
        window.dispatchEvent(new Event("storage"));
        if (choice === "accepted") {
            posthog.opt_in_capturing();
            posthog.capture("$pageview");
        }
    };

    if (storedChoice !== null) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-canvas/97 px-4 py-4 shadow-[0_-12px_30px_rgba(26,26,26,0.1)] backdrop-blur-sm sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <p className="text-sm leading-relaxed text-charcoal">
                    We use cookies to understand how visitors use our website and improve your experience. See our{" "}
                    <Link href="/cookies-policy" className="text-link-blue hover:underline">
                        Cookies Policy
                    </Link>{" "}
                    for details.
                </p>
                <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => choose("declined")}
                        className="flex-1 sm:flex-none"
                    >
                        Decline
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => choose("accepted")}
                        className="flex-1 sm:flex-none"
                    >
                        Accept
                    </Button>
                </div>
            </div>
        </div>
    );
}
