// features/marketing/components/ArticleDetailPage.tsx

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/marketing/data/category-meta";
import { ArticleBody } from "./ui/ArticleBody";
import { ArticleCard } from "./ui/ArticleCard";
import { ReadingProgressBar } from "./ui/ReadingProgressBar";
import type { Article } from "@/features/marketing/data/types";

interface ArticleDetailPageProps {
    article: Article;
    related: Article[];
}

export function ArticleDetailPage({ article, related }: ArticleDetailPageProps) {
    const meta = categoryMeta[article.category] ?? fallbackMeta;

    const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div>
            <ReadingProgressBar endElementId="related-articles" />
            {/* Hero */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                {/* Back link */}
                <Link
                    href="/article"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-6"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All Articles
                </Link>

                {/* Category badge */}
                <div className="mb-4">
                    <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.badge}`}>
                        {article.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 leading-tight mb-4">
                    {article.title}
                </h1>

                {/* Excerpt / standfirst */}
                <p className="text-lg text-gray-500 leading-relaxed mb-8">{article.excerpt}</p>

                {/* Author + meta */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                        <p className="text-xs text-gray-400">{article.author.role}</p>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {article.readTimeMinutes} min read
                        </span>
                    </div>
                </div>
            </div>

            {/* Cover image */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-8">
                <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden">
                    <Image
                        src={article.coverImageUrl ?? "/assets/blog-placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 896px"
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-gray-100" />
            </div>

            {/* Article body */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
                <ArticleBody blocks={article.body} />
            </div>

            {/* Author bio */}
            {article.author.bio && (
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-5">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{article.author.name}</p>
                                <p className="text-xs text-gray-400 mb-2">{article.author.role}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{article.author.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Related articles */}
            {related.length > 0 && (
                <div id="related-articles" className="border-t border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <h2 className="font-serif text-2xl font-normal text-gray-900 mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {related.map((a, i) => (
                                <ArticleCard key={a.slug} article={a} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
