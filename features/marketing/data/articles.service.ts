// features/marketing/data/articles.service.ts
// NOTE: CMS swap point — replace each function body with a Sanity query
// (e.g. sanityClient.fetch(...)) without changing signatures or call sites.

import { MOCK_ARTICLES } from "./articles.data";
import type { Article } from "./types";

export async function getArticles({
    page = 1,
    pageSize = 12,
    category,
}: {
    page?: number;
    pageSize?: number;
    category?: string;
}): Promise<{ items: Article[]; total: number; page: number; pageSize: number }> {
    const filtered =
        category && category !== "All"
            ? MOCK_ARTICLES.filter((a) => a.category === category)
            : MOCK_ARTICLES;
    const total = filtered.length;
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return { items, total, page, pageSize };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
    return MOCK_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function getRelatedArticles(
    currentSlug: string,
    category: string,
    limit: number
): Promise<Article[]> {
    return MOCK_ARTICLES.filter(
        (a) => a.slug !== currentSlug && a.category === category
    ).slice(0, limit);
}
