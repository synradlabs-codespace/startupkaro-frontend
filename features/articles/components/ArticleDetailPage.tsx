// features/articles/components/ArticleDetailPage.tsx

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, User } from "lucide-react";
import { getIcon } from "@/features/articles/lib/icon-map";
import { getArticleHeadings } from "@/features/articles/lib/article-headings";
import { ArticleBody } from "./ui/ArticleBody";
import { ArticleIndex } from "./ui/ArticleIndex";
import { ArticleCard } from "./ui/ArticleCard";
import { ArticleShareButton } from "./ui/ArticleShareButton";
import { ReadingProgressBar } from "./ui/ReadingProgressBar";
import type { Article, ArticleCard as ArticleCardType } from "@/features/articles/types";

interface ArticleDetailPageProps {
    article: Article;
    related: ArticleCardType[];
}

export function ArticleDetailPage({ article, related }: ArticleDetailPageProps) {
    const headings = getArticleHeadings(article.body);
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
                <Link
                    href="/article"
                    className="mb-6 inline-flex items-center gap-1.5 text-xs text-stone hover:text-slate transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All Articles
                </Link>

                {/* Category badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.categories.map((cat) => {
                        const Icon = getIcon(cat.iconName);
                        const color = cat.accentColor ?? "#787671";
                        return (
                            <span
                                key={cat.slug}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                style={{ backgroundColor: `${color}1A`, color }}
                            >
                                <Icon className="h-3 w-3" />
                                {cat.title}
                            </span>
                        );
                    })}
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink leading-tight mb-4">
                    {article.title}
                </h1>

                <p className="text-lg text-slate leading-relaxed mb-8">{article.summary}</p>

                {/* Author + meta */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                        {article.author.avatar ? (
                            <Image
                                src={article.author.avatar}
                                alt={article.author.name}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5 text-stone" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">{article.author.name}</p>
                        <p className="text-xs text-stone">{article.author.designation}</p>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center gap-4 text-xs text-stone">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </span>
                        {article.readTime != null && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                {article.readTime} min read
                            </span>
                        )}
                    </div>
                    <div className="w-full md:hidden">
                        <ArticleShareButton title={article.title} summary={article.summary} />
                    </div>
                </div>
            </div>

            {/* Cover image */}
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-8">
                <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden">
                    <Image
                        src={article.coverImage?.url ?? "/assets/blog-placeholder.jpg"}
                        alt={article.coverImage?.alt ?? article.title}
                        fill
                        className="object-cover"
                        priority
                        placeholder={article.coverImage?.lqip ? "blur" : "empty"}
                        blurDataURL={article.coverImage?.lqip}
                        sizes="(max-width: 768px) 100vw, 896px"
                    />
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="h-px bg-hairline" />
            </div>

            {/* Article body */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,768px)_220px] lg:px-8 xl:grid-cols-[minmax(0,768px)_260px]">
                <article className="min-w-0">
                    <ArticleBody blocks={article.body} headings={headings} />
                </article>
                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-5">
                        <ArticleShareButton title={article.title} summary={article.summary} className="w-full" />
                        <ArticleIndex headings={headings} />
                    </div>
                </aside>
            </div>

            {/* Author bio */}
            {article.author.bio && (
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="rounded-xl border border-hairline bg-surface p-5">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-surface-soft flex items-center justify-center shrink-0 overflow-hidden">
                                {article.author.avatar ? (
                                    <Image
                                        src={article.author.avatar}
                                        alt={article.author.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="h-5 w-5 text-stone" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink">{article.author.name}</p>
                                <p className="text-xs text-stone mb-2">{article.author.designation}</p>
                                <p className="text-xs text-slate leading-relaxed">{article.author.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Related articles */}
            {related.length > 0 && (
                <div id="related-articles" className="border-t border-hairline">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink mb-6">Related Articles</h2>
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
