// features/articles/components/ui/ArticleCard.tsx

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { getIcon } from "@/features/articles/lib/icon-map";
import type { ArticleCard as ArticleCardType } from "@/features/articles/types";

export function ArticleCard({ article }: { article: ArticleCardType; index?: number }) {
    const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Link
            href={`/article/${article.slug}`}
            className="group relative flex flex-col rounded-xl border border-hairline bg-canvas overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
        >
            {/* Cover image */}
            <div className="relative h-44 w-full overflow-hidden">
                <Image
                    src={article.coverImage?.url ?? "/assets/blog-placeholder.jpg"}
                    alt={article.coverImage?.alt ?? article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder={article.coverImage?.lqip ? "blur" : "empty"}
                    blurDataURL={article.coverImage?.lqip}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-col flex-1 p-5">
                {/* Categories + read time */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                        {article.categories.map((cat) => {
                            const Icon = getIcon(cat.iconName);
                            const color = cat.accentColor ?? "#787671";
                            return (
                                <span
                                    key={cat.slug}
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{
                                        backgroundColor: `${color}1A`,
                                        color,
                                    }}
                                >
                                    <Icon className="h-2.5 w-2.5" />
                                    {cat.title}
                                </span>
                            );
                        })}
                    </div>
                    {article.readTime != null && (
                        <span className="flex items-center gap-1 text-[11px] text-stone shrink-0">
                            <Clock className="h-3 w-3" />
                            {article.readTime} min
                        </span>
                    )}
                </div>

                {/* Title + summary */}
                <h3 className="text-sm font-semibold text-ink mb-1.5 leading-snug group-hover:underline decoration-hairline underline-offset-2">
                    {article.title}
                </h3>
                <p className="text-xs text-slate leading-relaxed flex-1">{article.summary}</p>

                <div className="h-px bg-hairline my-4" />

                {/* Author + date */}
                <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-ink truncate">{article.author.name}</p>
                        <p className="text-[11px] text-stone mt-0.5 truncate">{article.author.designation}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-stone shrink-0">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                    </span>
                </div>
            </div>
        </Link>
    );
}
