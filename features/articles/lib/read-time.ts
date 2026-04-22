import type { PortableTextBlock } from "@portabletext/types";

export function calculateReadTime(body: PortableTextBlock[]): number {
    const words = body
        .filter((b) => b._type === "block")
        .flatMap((b) => {
            const block = b as PortableTextBlock & { children?: Array<{ text?: string }> };
            return (block.children ?? []).map((c) => c.text ?? "");
        })
        .join(" ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    const minutes = Math.ceil(words / 200);
    const mediaBlocks = body.filter((b) =>
        ["image", "embedInstagram", "embedYouTube"].includes(b._type)
    ).length;

    return Math.max(1, minutes + Math.ceil(mediaBlocks * 0.2));
}
