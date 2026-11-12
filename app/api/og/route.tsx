// app/api/og/route.tsx
//
// Dynamic Open Graph image generator. Every page in the site links to this
// route (via lib/seo/og.ts) instead of shipping a static image, so pages
// that don't exist yet (new blog posts, new services, new jobs) still get a
// branded preview card.
//
// Card: white background, StartupKaro long logo top-left, title in black at
// the bottom. Shared frame lives in ./_shared.tsx (also used by the tool
// result cards). See docs/SEO_CAVEATS.md for the accepted tradeoffs of this
// approach (asset duplication, cache-busting, title length).

import { ImageResponse } from "next/og";
import { INK, OG_CACHE_HEADERS, OG_HEIGHT, OG_WIDTH, OgAccentBar, OgCanvas, OgEyebrow, loadOgAssets, ogFonts } from "./_shared";

export const runtime = "edge";

function fontSizeFor(title: string): number {
    if (title.length <= 45) return 68;
    if (title.length <= 90) return 54;
    return 44;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const rawTitle = searchParams.get("title")?.trim();
    const title = rawTitle && rawTitle.length > 0 ? rawTitle.slice(0, 120) : "StartupKaro";
    const label = searchParams.get("label")?.trim().slice(0, 24);

    const assets = await loadOgAssets();

    return new ImageResponse(
        (
            <OgCanvas logoSrc={assets.logoSrc}>
                <div style={{ display: "flex", flexDirection: "column", maxWidth: "980px" }}>
                    <OgAccentBar />
                    {label ? <OgEyebrow>{label}</OgEyebrow> : null}
                    <div
                        style={{
                            display: "flex",
                            fontSize: `${fontSizeFor(title)}px`,
                            fontWeight: 500,
                            lineHeight: 1.15,
                            color: INK,
                        }}
                    >
                        {title}
                    </div>
                </div>
            </OgCanvas>
        ),
        {
            width: OG_WIDTH,
            height: OG_HEIGHT,
            fonts: ogFonts(assets),
            headers: OG_CACHE_HEADERS,
        }
    );
}
