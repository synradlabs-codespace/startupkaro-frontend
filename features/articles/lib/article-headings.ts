import type { PortableTextBlock } from "@portabletext/types";

export type ArticleHeadingLevel = 1 | 2 | 3;

export interface ArticleHeading {
    id: string;
    key: string;
    text: string;
    level: ArticleHeadingLevel;
}

type HeadingBlock = PortableTextBlock & {
    _key?: string;
    style?: string;
    children?: Array<{ text?: string }>;
};

const HEADING_STYLES: Record<string, ArticleHeadingLevel> = {
    h1: 1,
    h2: 2,
    h3: 3,
};

function slugifyHeading(text: string): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return slug || "section";
}

export function getArticleHeadings(blocks: PortableTextBlock[]): ArticleHeading[] {
    const counts = new Map<string, number>();

    return blocks.reduce<ArticleHeading[]>((headings, block, index) => {
        const candidate = block as HeadingBlock;
        const level = candidate.style ? HEADING_STYLES[candidate.style] : undefined;

        if (!level || !candidate.children) return headings;

        const text = candidate.children
            .map((child) => child.text ?? "")
            .join("")
            .trim();

        if (!text) return headings;

        const baseId = slugifyHeading(text);
        const count = counts.get(baseId) ?? 0;
        counts.set(baseId, count + 1);

        headings.push({
            id: count === 0 ? baseId : `${baseId}-${count + 1}`,
            key: candidate._key ?? `${baseId}-${index}`,
            text,
            level,
        });

        return headings;
    }, []);
}
