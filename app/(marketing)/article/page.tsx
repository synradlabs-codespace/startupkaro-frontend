// app/(marketing)/article/page.tsx

import type { Metadata } from "next";
import { ArticleListPage } from "@/features/marketing/components/ArticleListPage";
import { getArticles } from "@/features/marketing/data/articles.service";

export const metadata: Metadata = {
    title: "Articles | StartupKaro",
    description:
        "Expert insights on GST, income tax, company compliance, startup law, and business finance — written by CAs, lawyers, and experienced founders.",
};

export default async function ArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const { page: p, category } = await searchParams;
    const page = Math.max(1, Number(p) || 1);
    const data = await getArticles({ page, pageSize: 12, category });

    return <ArticleListPage {...data} activeCategory={category ?? "All"} />;
}
