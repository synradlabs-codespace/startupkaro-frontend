import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ArticleCard } from "@/features/articles/types";

interface LatestArticlesSectionProps {
    articles: ArticleCard[];
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function LatestArticlesSection({ articles }: LatestArticlesSectionProps) {
    return (
        <section className="bg-white py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 items-start">
                    <div className="flex flex-col gap-4">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-coral">
                            Expert Insights
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl text-ink font-normal tracking-tight leading-tight">
                            From the Knowledge Hub
                        </h2>
                        <p className="text-body-muted text-base leading-relaxed">
                            Actionable advice on compliance, tax, and business growth.
                        </p>
                        <Link
                            href="/article"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary-brand hover:text-coral transition-colors mt-2 group"
                        >
                            View all articles
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Link
                                key={article._id}
                                href={`/article/${article.slug}`}
                                className="group flex flex-col rounded-lg border border-hairline bg-white transition-colors duration-200 overflow-hidden"
                            >
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                    {article.coverImage?.url ? (
                                        <Image
                                            src={article.coverImage.url}
                                            alt={article.coverImage.alt || article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 p-4">
                                    <div className="flex items-center gap-2 text-xs text-body-muted">
                                        <span>{article.author?.name}</span>
                                        <span>·</span>
                                        <span>{formatDate(article.publishedAt)}</span>
                                    </div>
                                    <h3 className="font-display text-sm font-normal text-ink leading-snug line-clamp-2 group-hover:text-coral transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-body-muted leading-relaxed line-clamp-2">
                                        {article.summary}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
