// app/api/og/route.tsx
//
// Dynamic Open Graph image generator. Every page in the site links to this
// route (via lib/seo/og.ts) instead of shipping a static image, so pages
// that don't exist yet (new blog posts, new services, new jobs) still get a
// branded preview card.
//
// Card: white background, StartupKaro long logo top-left, title in black at
// the bottom. See docs/SEO_CAVEATS.md for the accepted tradeoffs of this
// approach (asset duplication, cache-busting, title length).

import { ImageResponse } from "next/og";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;

const INK = "#1a1a1a";
const GRAPHITE = "#636363";
const BRAND_BLUE = "#296ef9";

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

    const [gilroyMedium, gilroyBold, logoData] = await Promise.all([
        fetch(new URL("./assets/Gilroy-Medium.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
        fetch(new URL("./assets/Gilroy-Bold.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
        fetch(new URL("./assets/logo.png", import.meta.url)).then((res) => res.arrayBuffer()),
    ]);

    const logoSrc = `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#ffffff",
                    padding: "64px",
                    fontFamily: "Gilroy",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc} alt="" height={44} style={{ objectFit: "contain" }} />

                <div style={{ display: "flex", flexDirection: "column", maxWidth: "980px" }}>
                    <div style={{ display: "flex", width: "72px", height: "6px", backgroundColor: BRAND_BLUE, marginBottom: "24px" }} />
                    {label ? (
                        <div
                            style={{
                                display: "flex",
                                fontSize: "24px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                color: GRAPHITE,
                                marginBottom: "16px",
                            }}
                        >
                            {label}
                        </div>
                    ) : null}
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
            </div>
        ),
        {
            width: WIDTH,
            height: HEIGHT,
            fonts: [
                { name: "Gilroy", data: gilroyMedium, weight: 500, style: "normal" },
                { name: "Gilroy", data: gilroyBold, weight: 700, style: "normal" },
            ],
            headers: {
                "Cache-Control": "public, immutable, no-transform, max-age=31536000",
            },
        }
    );
}
