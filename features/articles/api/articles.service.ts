import { sanityFetch } from "@/sanity/live";
import { client } from "@/sanity/client";
import {
    ARTICLES_LIST_QUERY,
    ARTICLES_COUNT_QUERY,
    ARTICLE_BY_SLUG_QUERY,
    RELATED_FALLBACK_QUERY,
    ALL_SLUGS_QUERY,
    LATEST_ARTICLES_QUERY,
} from "@/sanity/queries";
import type { Article, ArticleCard } from "@/features/articles/types";
import { calculateReadTime } from "@/features/articles/lib/read-time";
import type { PortableTextBlock } from "@portabletext/types";

const PAGE_SIZE = 12;

export async function getArticles({
    page = 1,
    pageSize = PAGE_SIZE,
    category,
}: {
    page?: number;
    pageSize?: number;
    category?: string;
}): Promise<{ items: ArticleCard[]; total: number; page: number; pageSize: number }> {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const categorySlug = category && category !== "All" ? category : null;

    const [listResult, countResult] = await Promise.all([
        sanityFetch({
            query: ARTICLES_LIST_QUERY,
            params: { start, end, categorySlug },
            tags: ["article"],
        }),
        sanityFetch({
            query: ARTICLES_COUNT_QUERY,
            params: { categorySlug },
            tags: ["article"],
        }),
    ]);

    const items = (listResult.data ?? []) as ArticleCard[];
    const total = (countResult.data ?? 0) as number;

    return { items, total, page, pageSize };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const result = await sanityFetch({
        query: ARTICLE_BY_SLUG_QUERY,
        params: { slug },
        tags: ["article", `article:${slug}`],
    });

    const raw = result.data as (Article & { body: PortableTextBlock[] }) | null;
    if (!raw) return null;

    const readTime =
        raw.readTime ?? calculateReadTime(raw.body ?? []);

    return { ...raw, readTime };
}

// Uses the plain client — safe to call from generateStaticParams (no draftMode() call)
export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
    const data = await client.fetch(ALL_SLUGS_QUERY);
    return (data ?? []) as { slug: string }[];
}

export async function getLatestArticles(limit = 3): Promise<ArticleCard[]> {
    const result = await sanityFetch({
        query: LATEST_ARTICLES_QUERY,
        params: { limit },
        tags: ["article"],
    });
    return (result.data ?? []) as ArticleCard[];
}

export async function getRelatedArticles(
    currentSlug: string,
    categorySlugs: string[],
    limit: number
): Promise<ArticleCard[]> {
    const articleResult = await sanityFetch({
        query: ARTICLE_BY_SLUG_QUERY,
        params: { slug: currentSlug },
        tags: [`article:${currentSlug}`],
    });

    const article = articleResult.data as { _id?: string; relatedManual?: ArticleCard[] } | null;
    const manual: ArticleCard[] = article?.relatedManual ?? [];
    const currentId = article?._id ?? "";

    if (manual.length >= limit) return manual.slice(0, limit);

    const remaining = limit - manual.length;
    const excludeIds = [currentId, ...manual.map((a) => (a as ArticleCard & { _id?: string })._id).filter(Boolean)];

    const fallbackResult = await sanityFetch({
        query: RELATED_FALLBACK_QUERY,
        params: {
            currentSlug,
            excludeIds,
            categorySlugs,
            limit: remaining,
        },
        tags: ["article"],
    });

    const fallback = (fallbackResult.data ?? []) as ArticleCard[];
    return [...manual, ...fallback].slice(0, limit);
}
