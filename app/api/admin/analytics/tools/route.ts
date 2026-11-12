// app/api/admin/analytics/tools/route.ts
//
// Free-tools usage + sharing stats for /admin/analytics. Reads the events
// emitted by features/tools/lib/track.ts. Same auth gate, month handling and
// "not configured" behaviour as the sibling traffic route.

import { type NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";
import { formatDayLabel, isAuthorized, isPostHogConfigured, resolveMonth, runHogQL } from "@/lib/server/posthog-analytics";
import { TOOLS } from "@/features/tools/data/tools.registry";

export interface AdminToolsAnalytics {
    month: string;
    totals: { uses: number; shares: number; sharedLinkOpens: number; shareRate: number };
    trend: { day: number; label: string; uses: number; shares: number }[];
    byTool: { slug: string; name: string; uses: number; shares: number; opens: number }[];
    byMethod: { method: string; label: string; shares: number }[];
}

// Keep in sync with features/tools/lib/track.ts
const EVENT_USED = "tool_used";
const EVENT_SHARED = "tool_result_shared";
const EVENT_OPENED = "tool_shared_link_opened";

const METHOD_LABELS: Record<string, string> = {
    link: "Copied link",
    image: "Downloaded image",
    image_square: "Downloaded square image",
    native: "Phone share menu",
    whatsapp: "WhatsApp",
    linkedin: "LinkedIn",
    x: "X (Twitter)",
};

const SLUG_PATTERN = /^[a-z0-9-]+$/;
// Allowlist straight from the registry; anything else in properties.tool is ignored.
const TOOL_NAMES = new Map(TOOLS.filter((t) => SLUG_PATTERN.test(t.slug)).map((t) => [t.slug, t.name]));
const TOOL_LIST_SQL = [...TOOL_NAMES.keys()].map((slug) => `'${slug}'`).join(", ");

function json(body: ApiResponse<AdminToolsAnalytics | null>, status: number) {
    return NextResponse.json(body, { status });
}

export async function GET(req: NextRequest) {
    if (!isPostHogConfigured()) {
        return json({ data: null, success: false, message: "Visitor analytics is not configured yet." }, 200);
    }

    const authorized = await isAuthorized(req.headers.get("authorization"));
    if (!authorized) {
        return json({ data: null, success: false, message: "Unauthorized." }, 401);
    }

    const { month, start, end } = resolveMonth(req.nextUrl.searchParams.get("month"));
    const range = `timestamp >= toDateTime('${start.toISOString()}') AND timestamp < toDateTime('${end.toISOString()}')`;
    const base = `event IN ('${EVENT_USED}', '${EVENT_SHARED}', '${EVENT_OPENED}') AND ${range} AND properties.tool IN (${TOOL_LIST_SQL})`;

    try {
        const [totalRows, trendRows, toolRows, methodRows] = await Promise.all([
            runHogQL<[number, number, number]>(`
                SELECT
                    countIf(event = '${EVENT_USED}') AS uses,
                    countIf(event = '${EVENT_SHARED}') AS shares,
                    countIf(event = '${EVENT_OPENED}') AS opens
                FROM events
                WHERE ${base}
            `),
            runHogQL<[string, number, number]>(`
                SELECT
                    toStartOfDay(timestamp) AS bucket,
                    countIf(event = '${EVENT_USED}') AS uses,
                    countIf(event = '${EVENT_SHARED}') AS shares
                FROM events
                WHERE ${base}
                GROUP BY bucket
                ORDER BY bucket
            `),
            runHogQL<[string, number, number, number]>(`
                SELECT
                    properties.tool AS tool,
                    countIf(event = '${EVENT_USED}') AS uses,
                    countIf(event = '${EVENT_SHARED}') AS shares,
                    countIf(event = '${EVENT_OPENED}') AS opens
                FROM events
                WHERE ${base}
                GROUP BY tool
                ORDER BY uses DESC
            `),
            runHogQL<[string, number]>(`
                SELECT properties.method AS method, count() AS shares
                FROM events
                WHERE event = '${EVENT_SHARED}' AND ${range} AND properties.tool IN (${TOOL_LIST_SQL})
                GROUP BY method
                ORDER BY shares DESC
            `),
        ]);

        const [uses = 0, shares = 0, sharedLinkOpens = 0] = totalRows[0] ?? [];

        const data: AdminToolsAnalytics = {
            month,
            totals: {
                uses,
                shares,
                sharedLinkOpens,
                shareRate: uses > 0 ? Math.round((shares / uses) * 1000) / 10 : 0,
            },
            trend: trendRows.map(([bucket, u, s]) => ({
                day: new Date(bucket).getUTCDate(),
                label: formatDayLabel(bucket),
                uses: u ?? 0,
                shares: s ?? 0,
            })),
            byTool: toolRows
                .filter(([slug]) => TOOL_NAMES.has(slug))
                .map(([slug, u, s, o]) => ({ slug, name: TOOL_NAMES.get(slug) ?? slug, uses: u ?? 0, shares: s ?? 0, opens: o ?? 0 })),
            byMethod: methodRows
                .filter(([method]) => method && METHOD_LABELS[method])
                .map(([method, s]) => ({ method, label: METHOD_LABELS[method], shares: s ?? 0 })),
        };

        return json({ data, success: true, message: "OK" }, 200);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Tool data is temporarily unavailable.";
        return json({ data: null, success: false, message }, 502);
    }
}
