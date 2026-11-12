import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";
import { formatDayLabel, isAuthorized, isPostHogConfigured, resolveMonth, runHogQL } from "@/lib/server/posthog-analytics";

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

export async function GET(req: NextRequest) {
    if (!isPostHogConfigured()) {
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
