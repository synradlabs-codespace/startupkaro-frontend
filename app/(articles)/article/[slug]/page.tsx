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
import { urlFor } from "@/sanity/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { NOINDEX } from "@/lib/seo/site";
import { ogImageUrl } from "@/lib/seo/og";
import { articleJsonLd, breadcrumbListJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

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
    if (!article) return NOINDEX;

    if (article.seo?.noIndex) return NOINDEX;

    const title = article.seo?.title ?? article.title;
    const description = article.seo?.description ?? article.summary;

    let image: { url: string; alt?: string } | undefined;
    if (article.seo?.ogImage) {
        image = {
            url: urlFor(article.seo.ogImage).width(1200).height(630).fit("crop").url(),
            alt: article.seo.ogImageAlt ?? title,
        };
    } else if (article.coverImage?.url) {
        image = {
            url: urlFor(article.coverImage.url).width(1200).height(630).fit("crop").url(),
            alt: article.coverImage.alt ?? title,
        };
    } else {
        image = { url: ogImageUrl(title, "Article"), alt: title };
    }

    return buildMetadata({
        title,
        description,
        path: `/article/${slug}`,
        canonicalOverride: article.seo?.canonicalUrl,
        keywords: article.seo?.keywords,
        image,
        type: "article",
    });
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

    const imageUrl = article.seo?.ogImage
        ? urlFor(article.seo.ogImage).width(1200).height(630).fit("crop").url()
        : article.coverImage?.url
          ? urlFor(article.coverImage.url).width(1200).height(630).fit("crop").url()
          : ogImageUrl(article.title, "Article");

    return (
        <>
            <JsonLd
                data={articleJsonLd({
                    title: article.title,
                    description: article.seo?.description ?? article.summary,
                    path: `/article/${slug}`,
                    imageUrl,
                    publishedAt: article.publishedAt,
                    updatedAt: article.updatedAt,
                    authorName: article.author.name,
                    authorTitle: article.author.designation,
                })}
            />
            <JsonLd
                data={breadcrumbListJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Articles", path: "/article" },
                    { name: article.title, path: `/article/${slug}` },
                ])}
            />
            <ArticleDetailPage article={article} related={related} />
            <SanityLive />
        </>
    );
}
