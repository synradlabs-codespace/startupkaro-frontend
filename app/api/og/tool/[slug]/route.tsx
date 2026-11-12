// app/api/og/tool/[slug]/route.tsx
//
// Result card image for the free financial tools. Used as:
//   1. og:image for a shared result link (/tools/<slug>?<inputs>), so WhatsApp /
//      LinkedIn / X previews show the sender's actual numbers, and
//   2. the "Download image" action on every tool page.
//
// It follows the site-wide OG standard from ../../_shared.tsx and recomputes
// the result from the query params with the SAME pure engine the page uses
// (features/tools/lib/engines.ts), so the image can never disagree with the
// page. Inputs are parsed + clamped; garbage falls back to defaults. Every
// card carries a chart (../../_charts.tsx) as the main visual cue.
//
// ?format=square renders a 1080×1080 variant for Instagram / WhatsApp status.
// Bump TOOL_CARD_VERSION in lib/seo/og.ts whenever this layout changes.

import { ImageResponse } from "next/og";
import {
    GRAPHITE,
    HAIRLINE,
    INK,
    OG_CACHE_HEADERS,
    OG_HEIGHT,
    OG_WIDTH,
    OgAccentBar,
    OgCanvas,
    OgEyebrow,
    loadOgAssets,
    ogFonts,
} from "../../_shared";
import { CardChartView } from "../../_charts";
import { getEngine, type CardSummary } from "@/features/tools/lib/engines";
import { parseInputs } from "@/features/tools/lib/params";
import { formatINRCompact } from "@/features/tools/lib/format";
import { getTool } from "@/features/tools/data/tools.registry";
import { SITE_URL } from "@/lib/seo/site";
import { sanitizeSeoText } from "@/lib/seo/text";

export const runtime = "edge";

const SQUARE = 1080;
// Gilroy has no ₹ glyph (renders as tofu in Satori), so card text uses "Rs.".
const SYMBOL = "Rs. ";
const fmt = (value: number) => formatINRCompact(value, { symbol: SYMBOL });

function headlineSize(text: string, square: boolean): number {
    if (square) return text.length <= 60 ? 60 : text.length <= 100 ? 50 : 42;
    return text.length <= 60 ? 40 : text.length <= 90 ? 34 : 30;
}

function Rows({ rows, square }: { rows: CardSummary["rows"]; square: boolean }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: square ? "row" : "column",
                gap: square ? "32px" : "14px",
                marginTop: square ? "32px" : "24px",
                paddingTop: square ? "24px" : "20px",
                borderTop: `1px solid ${HAIRLINE}`,
            }}
        >
            {rows.map((row) => (
                <div key={row.label} style={{ display: "flex", flexDirection: "column", ...(square ? { flex: 1 } : {}) }}>
                    <div style={{ display: "flex", fontSize: square ? "20px" : "16px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: GRAPHITE, marginBottom: "4px" }}>
                        {sanitizeSeoText(row.label)}
                    </div>
                    <div style={{ display: "flex", fontSize: square ? "36px" : "28px", fontWeight: 500, color: INK }}>{row.value}</div>
                </div>
            ))}
        </div>
    );
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const square = searchParams.get("format") === "square";
    const width = square ? SQUARE : OG_WIDTH;
    const height = square ? SQUARE : OG_HEIGHT;

    const tool = getTool(slug);
    const engine = getEngine(slug);
    const assets = await loadOgAssets();
    const host = SITE_URL.replace(/^https?:\/\//, "");

    // Unknown tool: plain branded card pointing at the hub.
    if (!tool || !engine) {
        return new ImageResponse(
            (
                <OgCanvas logoSrc={assets.logoSrc}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <OgAccentBar />
                        <OgEyebrow>Free Tools</OgEyebrow>
                        <div style={{ display: "flex", fontSize: "68px", fontWeight: 500, lineHeight: 1.15, color: INK }}>Free Financial Calculators for India</div>
                    </div>
                </OgCanvas>
            ),
            { width, height, fonts: ogFonts(assets), headers: OG_CACHE_HEADERS }
        );
    }

    const summary = engine.cardSummary(parseInputs(engine.fields, searchParams), SYMBOL);
    const headline = sanitizeSeoText(summary.headline);
    const footer = `${host}/tools/${slug} · Indicative estimate`;

    const headlineEl = (
        <div style={{ display: "flex", fontSize: `${headlineSize(headline, square)}px`, fontWeight: 500, lineHeight: 1.15, color: INK }}>{headline}</div>
    );
    const footerEl = (
        <div style={{ display: "flex", marginTop: square ? "40px" : "22px", fontSize: square ? "22px" : "17px", fontWeight: 500, color: GRAPHITE }}>{footer}</div>
    );

    return new ImageResponse(
        (
            <OgCanvas logoSrc={assets.logoSrc}>
                {square ? (
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <OgAccentBar />
                        <OgEyebrow>{`Free Tool · ${tool.name}`}</OgEyebrow>
                        {headlineEl}
                        <Rows rows={summary.rows} square />
                        <div style={{ display: "flex", marginTop: "40px" }}>
                            <CardChartView chart={summary.chart} width={952} height={300} fmt={fmt} size={20} />
                        </div>
                        {footerEl}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <OgAccentBar />
                        <OgEyebrow>{`Free Tool · ${tool.name}`}</OgEyebrow>
                        <div style={{ display: "flex", gap: "48px", alignItems: "flex-end" }}>
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                {headlineEl}
                                <Rows rows={summary.rows} square={false} />
                            </div>
                            <div style={{ display: "flex", width: "480px" }}>
                                <CardChartView chart={summary.chart} width={480} height={200} fmt={fmt} size={16} />
                            </div>
                        </div>
                        {footerEl}
                    </div>
                )}
            </OgCanvas>
        ),
        { width, height, fonts: ogFonts(assets), headers: OG_CACHE_HEADERS }
    );
}
