// app/(articles)/article/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetailPage } from "@/features/articles/components/ArticleDetailPage";
import {
    getArticleBySlug,
    getAllArticleSlugs,
    getRelatedArticles,
} from "@/features/articles/data/articles.service";

export async function generateStaticParams() {
    return getAllArticleSlugs();
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return {};
    return {
        title: article.seo?.title ?? `${article.title} | StartupKaro`,
        description: article.seo?.description ?? article.excerpt,
        openGraph: {
            type: "article",
            publishedTime: article.publishedAt,
            authors: [article.author.name],
        },
    };
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) notFound();

    const related = await getRelatedArticles(slug, article.category, 3);
    return <ArticleDetailPage article={article} related={related} />;
}
