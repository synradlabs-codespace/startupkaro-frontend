// features/articles/components/ui/ArticleCard.tsx

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { categoryMeta, fallbackMeta } from "@/features/articles/data/category-meta";
import type { Article } from "@/features/articles/data/types";

const ACCENTS = ["#FF9933", "#000080", "#6BAE3A"] as const;

export function ArticleCard({ article, index }: { article: Article; index: number }) {
    const meta = categoryMeta[article.category] ?? fallbackMeta;
    const accent = ACCENTS[index % 3];

    const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <Link
            href={`/article/${article.slug}`}
            className="group relative flex flex-col rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
            {/* Top accent strip — always visible, cycles by index */}
            <div className="h-[3px] w-full shrink-0" style={{ backgroundColor: accent }} />

            {/* Cover image */}
            <div className="relative h-44 w-full overflow-hidden">
                <Image
                    src={article.coverImageUrl ?? "/assets/blog-placeholder.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-col flex-1 p-5">
                {/* Category + read time */}
                <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.badge}`}>
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="h-3 w-3" />
                        {article.readTimeMinutes} min read
                    </span>
                </div>

                {/* Title + excerpt */}
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5 leading-snug group-hover:text-[#000080] transition-colors">
                    {article.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{article.excerpt}</p>

                <div className="h-px bg-gray-100 my-4" />

                {/* Author + date */}
                <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{article.author.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">{article.author.role}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 shrink-0">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                    </span>
                </div>
            </div>
        </Link>
    );
}
