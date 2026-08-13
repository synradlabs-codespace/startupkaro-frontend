import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://startupkarobackend.up.railway.app/api/v1";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

export interface AdminTrafficAnalytics {
    today: number;
    last7Days: number;
    last30Days: number;
    /** Resolved "YYYY-MM" this response's trend/topPages are scoped to. */
    month: string;
    /** `day` (1-31) lets the frontend align two different months' trends on one chart. */
    trend: { day: number; label: string; visitors: number }[];
    topPages: { pathname: string; views: number }[];
    byCountry: { country: string; visitors: number }[];
    trafficSources: { source: string; visitors: number }[];
}

function json(body: ApiResponse<AdminTrafficAnalytics | null>, status: number) {
    return NextResponse.json(body, { status });
}

/**
 * Auth gate. proxy.ts middleware is disabled repo-wide, so this route must
 * guard itself. A cookie/role check alone isn't enough (client-set, forgeable) —
 * instead the caller's token is forwarded to an existing backend admin endpoint
 * that already enforces staff auth, matching the trust boundary the rest of
 * /admin/analytics relies on.
 */
async function isAuthorized(authHeader: string | null): Promise<boolean> {
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

async function runHogQL<T = unknown[]>(query: string): Promise<T[]> {
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
function resolveMonth(monthParam: string | null): { month: string; start: Date; end: Date } {
    const now = new Date();
    const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const month = monthParam && MONTH_PATTERN.test(monthParam) && monthParam <= currentMonth ? monthParam : currentMonth;

    const [year, monthNum] = month.split("-").map(Number);
    const start = new Date(Date.UTC(year, monthNum - 1, 1));
    const end = new Date(Date.UTC(year, monthNum, 1));
    return { month, start, end };
}

function formatDayLabel(isoTimestamp: string) {
    const date = new Date(isoTimestamp);
    if (Number.isNaN(date.getTime())) return isoTimestamp;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export async function GET(req: NextRequest) {
    if (!POSTHOG_PROJECT_ID || !POSTHOG_PERSONAL_API_KEY) {
        return json(
            { data: null, success: false, message: "Visitor analytics is not configured yet." },
            200
        );
    }

    const authorized = await isAuthorized(req.headers.get("authorization"));
    if (!authorized) {
        return json({ data: null, success: false, message: "Unauthorized." }, 401);
    }

    const { month, start, end } = resolveMonth(req.nextUrl.searchParams.get("month"));
    const startIso = start.toISOString();
    const endIso = end.toISOString();

    try {
        const [counts, trendRows, topPageRows, countryRows, sourceRows] = await Promise.all([
            // Rolling "right now" counts — intentionally independent of the
            // browsed month, since these answer "how are we doing today", not
            // "how did this month go".
            runHogQL<[number, number, number]>(`
                SELECT
                    countDistinctIf(person_id, timestamp >= toStartOfDay(now())) AS today,
                    countDistinctIf(person_id, timestamp >= now() - INTERVAL 7 DAY) AS last7,
                    countDistinctIf(person_id, timestamp >= now() - INTERVAL 30 DAY) AS last30
                FROM events
                WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY
            `),
            runHogQL<[string, number]>(`
                SELECT toStartOfDay(timestamp) AS bucket, count(DISTINCT person_id) AS visitors
                FROM events
                WHERE event = '$pageview' AND timestamp >= toDateTime('${startIso}') AND timestamp < toDateTime('${endIso}')
                GROUP BY bucket
                ORDER BY bucket
            `),
            runHogQL<[string, number]>(`
                SELECT properties.$pathname AS pathname, count() AS views
                FROM events
                WHERE event = '$pageview'
                    AND timestamp >= toDateTime('${startIso}') AND timestamp < toDateTime('${endIso}')
                    AND properties.$pathname IS NOT NULL
                GROUP BY pathname
                ORDER BY views DESC
                LIMIT 10
            `),
            runHogQL<[string, number]>(`
                SELECT
                    multiIf(properties.$geoip_country_name IS NULL OR properties.$geoip_country_name = '', 'Unknown', properties.$geoip_country_name) AS country,
                    count(DISTINCT person_id) AS visitors
                FROM events
                WHERE event = '$pageview' AND timestamp >= toDateTime('${startIso}') AND timestamp < toDateTime('${endIso}')
                GROUP BY country
                ORDER BY visitors DESC
                LIMIT 10
            `),
            runHogQL<[string, number]>(`
                SELECT
                    multiIf(
                        properties.utm_source IS NOT NULL AND properties.utm_source != '', properties.utm_source,
                        properties.$referring_domain IS NULL OR properties.$referring_domain = '' OR properties.$referring_domain = '$direct', 'Direct',
                        properties.$referring_domain
                    ) AS source,
                    count(DISTINCT person_id) AS visitors
                FROM events
                WHERE event = '$pageview' AND timestamp >= toDateTime('${startIso}') AND timestamp < toDateTime('${endIso}')
                GROUP BY source
                ORDER BY visitors DESC
                LIMIT 10
            `),
        ]);

        const [today, last7Days, last30Days] = counts[0] ?? [0, 0, 0];

        const data: AdminTrafficAnalytics = {
            today: today ?? 0,
            last7Days: last7Days ?? 0,
            last30Days: last30Days ?? 0,
            month,
            trend: trendRows.map(([bucket, visitors]) => ({
                day: new Date(bucket).getUTCDate(),
                label: formatDayLabel(bucket),
                visitors: visitors ?? 0,
            })),
            topPages: topPageRows.map(([pathname, views]) => ({
                pathname: pathname ?? "/",
                views: views ?? 0,
            })),
            byCountry: countryRows.map(([country, visitors]) => ({
                country: country ?? "Unknown",
                visitors: visitors ?? 0,
            })),
            trafficSources: sourceRows.map(([source, visitors]) => ({
                source: source ?? "Direct",
                visitors: visitors ?? 0,
            })),
        };

        return json({ data, success: true, message: "OK" }, 200);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Visitor data is temporarily unavailable.";
        return json({ data: null, success: false, message }, 502);
    }
}
