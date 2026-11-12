// app/api/og/_shared.tsx
//
// Shared building blocks for every generated image on the site, so all cards
// (page OG cards from /api/og and tool result cards from /api/og/tool/[slug])
// follow one visual standard: white background, 64px padding, StartupKaro
// long logo top-left, 72×6 brand-blue accent bar, uppercase Gilroy Bold
// eyebrow in graphite, Gilroy Medium headline in ink.
//
// The `_` prefix keeps this folder-private (not a route). Asset URLs resolve
// relative to this module, so the fonts/logo stay in ./assets.

import type { ReactNode } from "react";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export const INK = "#1a1a1a";
export const CHARCOAL = "#3d3d3d";
export const GRAPHITE = "#636363";
export const HAIRLINE = "#e8e8e8";
export const BRAND_BLUE = "#296ef9";
export const TINT_SKY = "#c9e0fc";

export const OG_CACHE_HEADERS = {
    "Cache-Control": "public, immutable, no-transform, max-age=31536000",
};

export interface OgAssets {
    gilroyMedium: ArrayBuffer;
    gilroyBold: ArrayBuffer;
    logoSrc: string;
}

export async function loadOgAssets(): Promise<OgAssets> {
    const [gilroyMedium, gilroyBold, logoData] = await Promise.all([
        fetch(new URL("./assets/Gilroy-Medium.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
        fetch(new URL("./assets/Gilroy-Bold.ttf", import.meta.url)).then((res) => res.arrayBuffer()),
        fetch(new URL("./assets/logo.png", import.meta.url)).then((res) => res.arrayBuffer()),
    ]);
    return {
        gilroyMedium,
        gilroyBold,
        logoSrc: `data:image/png;base64,${Buffer.from(logoData).toString("base64")}`,
    };
}

export function ogFonts(assets: OgAssets) {
    return [
        { name: "Gilroy", data: assets.gilroyMedium, weight: 500 as const, style: "normal" as const },
        { name: "Gilroy", data: assets.gilroyBold, weight: 700 as const, style: "normal" as const },
    ];
}

/** Outer white canvas + logo. Children are laid out at the bottom (space-between). */
export function OgCanvas({ logoSrc, children }: { logoSrc: string; children: ReactNode }) {
    return (
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
            {children}
        </div>
    );
}

export function OgAccentBar() {
    return <div style={{ display: "flex", width: "72px", height: "6px", backgroundColor: BRAND_BLUE, marginBottom: "24px" }} />;
}

export function OgEyebrow({ children }: { children: ReactNode }) {
    return (
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
            {children}
        </div>
    );
}
