// app/(articles)/article/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetailPage } from "@/features/articles/components/ArticleDetailPage";
import {
    getArticleBySlug,
    getAllArticleSlugs,
    getRelatedArticles,
} from "@/features/articles/api/articles.service";
import { SanityLive } from "@/sanity/live";

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

    const ogImages = [];
    if (article.seo?.ogImage) ogImages.push({ url: article.seo.ogImage });
    else if (article.coverImage?.url) ogImages.push({ url: article.coverImage.url });

    return {
        title: article.seo?.title ?? `${article.title} | StartupKaro`,
        description: article.seo?.description ?? article.summary,
        keywords: article.seo?.keywords,
        openGraph: {
            type: "article",
            publishedTime: article.publishedAt,
            modifiedTime: article.updatedAt,
            authors: [article.author.name],
            images: ogImages,
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

    const categorySlugs = article.categories.map((c) => c.slug);
    const related = await getRelatedArticles(slug, categorySlugs, 3);

    return (
        <>
            <ArticleDetailPage article={article} related={related} />
            <SanityLive />
        </>
    );
}
