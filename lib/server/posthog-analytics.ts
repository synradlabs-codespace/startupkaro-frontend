// lib/server/posthog-analytics.ts
//
// Server-only helpers shared by the /api/admin/analytics/* route handlers that
// read aggregated website stats from PostHog. The personal API key never
// leaves the server.

import "server-only";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://startupkarobackend.up.railway.app/api/v1";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

export function isPostHogConfigured(): boolean {
    return Boolean(POSTHOG_PROJECT_ID && POSTHOG_PERSONAL_API_KEY);
}

/**
 * Auth gate. proxy.ts middleware is disabled repo-wide, so these routes must
 * guard themselves. A cookie/role check alone isn't enough (client-set, forgeable) —
 * instead the caller's token is forwarded to an existing backend admin endpoint
 * that already enforces staff auth, matching the trust boundary the rest of
 * /admin/analytics relies on.
 */
export async function isAuthorized(authHeader: string | null): Promise<boolean> {
    if (!authHeader) return false;
    try {
        const res = await fetch(`${BACKEND_API_URL}/admin/analytics/orders`, {
            headers: { Authorization: authHeader },
            cache: "no-store",
        });
        return res.ok;
    } catch {
        return false;
    }
}

export async function runHogQL<T = unknown[]>(query: string): Promise<T[]> {
    const res = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
        },
        body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`PostHog query failed (${res.status}): ${text.slice(0, 300)}`);
    }

    const payload = (await res.json()) as { results?: T[] };
    return payload.results ?? [];
}

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Parses a "YYYY-MM" param, falling back to (and clamping future months to) the current month. */
export function resolveMonth(monthParam: string | null): { month: string; start: Date; end: Date } {
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const month = monthParam && MONTH_PATTERN.test(monthParam) && monthParam <= currentMonth ? monthParam : currentMonth;

    const [year, monthNum] = month.split("-").map(Number);
    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 1));
    return { month, start, end };
}

export function formatDayLabel(isoTimestamp: string) {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) return isoTimestamp;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
