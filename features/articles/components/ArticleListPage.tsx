// features/articles/components/ArticleListPage.tsx

import { BookOpen } from "lucide-react";
import { ArticleCard } from "./ui/ArticleCard";
import { ArticleFilters } from "./ui/ArticleFilters";
import { ArticlePagination } from "./ui/ArticlePagination";
import type { Article } from "@/features/articles/data/types";

interface ArticleListPageProps {
    items: Article[];
    total: number;
    page: number;
    pageSize: number;
    activeCategory: string;
}

export function ArticleListPage({ items, total, page, pageSize, activeCategory }: ArticleListPageProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Page header */}
            <div>
                <p className="text-xs tracking-[0.3em] uppercase font-mono text-[#FF9933] mb-3">
                    Insights &amp; Expertise
                </p>
                <h1 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 mb-2">Articles</h1>
                <p className="text-sm text-gray-500">
                    Expert perspectives from CAs, tax analysts, lawyers, and business founders.
                </p>
            </div>

            {/* Category filters */}
            <ArticleFilters activeCategory={activeCategory} />

            {/* Result count */}
            {total > 0 && (
                <p className="text-xs text-gray-400">
                    {total} article{total !== 1 ? "s" : ""}
                    {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                </p>
            )}

            {/* Article grid */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">No articles found</p>
                    <p className="text-xs text-gray-400">Try a different category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {items.map((article, i) => (
                        <ArticleCard key={article.slug} article={article} index={i} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pt-4">
                    <ArticlePagination page={page} totalPages={totalPages} activeCategory={activeCategory} />
                </div>
            )}
        </div>
    );
}
