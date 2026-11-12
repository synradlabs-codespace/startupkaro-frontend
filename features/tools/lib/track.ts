// features/tools/lib/track.ts
//
// Thin, consent-respecting wrapper around posthog.capture for the free tools.
// PostHog is initialised only in app/(marketing)/layout.tsx and stays opted
// out until the visitor accepts cookies; this wrapper is a no-op otherwise.
//
// Event names are read back by app/api/admin/analytics/tools/route.ts. Keep
// the two in sync if you rename anything.

import posthog from "posthog-js";

export const TOOL_EVENTS = {
    used: "tool_used",
    shared: "tool_result_shared",
    sharedLinkOpened: "tool_shared_link_opened",
} as const;

export type ShareMethod = "link" | "image" | "image_square" | "native" | "whatsapp" | "linkedin" | "x";

function capture(event: string, properties: Record<string, string>) {
    try {
        if (typeof window === "undefined") return;
        if (!(posthog as unknown as { __loaded?: boolean }).__loaded) return;
        if (posthog.has_opted_out_capturing()) return;
        posthog.capture(event, properties);
    } catch {
        // Analytics must never break a calculator.
    }
}

export function trackToolUsed(tool: string, category: string) {
    capture(TOOL_EVENTS.used, { tool, category });
}

export function trackToolShared(tool: string, method: ShareMethod) {
    capture(TOOL_EVENTS.shared, { tool, method });
}

export function trackSharedLinkOpened(tool: string) {
    capture(TOOL_EVENTS.sharedLinkOpened, { tool });
}
