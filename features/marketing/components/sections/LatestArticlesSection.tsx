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
    const cards = articles.slice(0, 3);

    return (
        <section className="bg-canvas py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-8">
                {/* Header row */}
                <div className="flex flex-col items-start justify-between gap-4 mb-10 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite mb-2">
                            Expert Insights
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl text-ink font-medium leading-tight">
                            From the Knowledge Hub
                        </h2>
                    </div>
                    <Link
                        href="/article"
                        className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-charcoal transition-colors group"
                    >
                        View all articles
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* 3-column equal grid */}
                <div className="rounded-2xl border border-hairline bg-cloud p-5 md:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cards.map((article) => (
                        <Link
                            key={article._id}
                            href={`/article/${article.slug}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand hover:shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                        >
                            <div className="relative h-44 shrink-0 overflow-hidden bg-surface">
                                {article.coverImage?.url ? (
                                    <Image
                                        src={article.coverImage.url}
                                        alt={article.coverImage.alt || article.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-surface" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2.5 p-5 flex-1">
                                <div className="flex items-center gap-2 text-xs text-graphite">
                                    <span className="font-medium text-slate">{article.author?.name}</span>
                                    <span>·</span>
                                    <span>{formatDate(article.publishedAt)}</span>
                                </div>
                                <h3 className="font-display text-base font-semibold text-ink leading-snug line-clamp-2 group-hover:underline decoration-hairline underline-offset-2">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-slate leading-relaxed line-clamp-2 flex-1">
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
