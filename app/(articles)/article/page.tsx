// app/(articles)/article/page.tsx

import type { Metadata } from "next";
import { ArticleListPage } from "@/features/articles/components/ArticleListPage";
import { getArticles } from "@/features/articles/api/articles.service";
import { getAllCategories } from "@/features/articles/api/categories.service";
import { SanityLive } from "@/sanity/live";
import { buildMetadata } from "@/lib/seo/metadata";

const ARTICLES_DESCRIPTION =
    "Expert insights on GST, income tax, company compliance, startup law, and business finance, written by CAs, lawyers, and experienced founders.";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}): Promise<Metadata> {
    const { page, category } = await searchParams;

    // Each page/category combination is a genuinely different set of articles,
    // so it gets its own self-referential canonical (not collapsed to /article).
    // that keeps every combination indexable instead of hiding pages 2+ from Google.
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (page && page !== "1") params.set("page", page);
    const query = params.toString();
    const path = query ? `/article?${query}` : "/article";

    return buildMetadata({
        title: "Articles",
        description: ARTICLES_DESCRIPTION,
        path,
    });
}

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const { page: p, category } = await searchParams;
    const page = Math.max(1, Number(p) || 1);

    const [data, categories] = await Promise.all([
        getArticles({ page, pageSize: 12, category }),
        getAllCategories(),
    ]);

    return (
        <>
            <ArticleListPage
                {...data}
                activeCategory={category ?? "All"}
                categories={categories}
            />
            <SanityLive />
        </>
    );
}
