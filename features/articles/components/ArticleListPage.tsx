// features/articles/components/ArticleListPage.tsx

import { BookOpen } from "lucide-react";
import { ArticleCard } from "./ui/ArticleCard";
import { ArticleFilters } from "./ui/ArticleFilters";
import { ArticlePagination } from "./ui/ArticlePagination";
import type { ArticleCard as ArticleCardType, Category } from "@/features/articles/types";

interface ArticleListPageProps {
    items: ArticleCardType[];
    total: number;
    page: number;
    pageSize: number;
    activeCategory: string;
    categories: Category[];
}

export function ArticleListPage({
    items,
    total,
    page,
    pageSize,
    activeCategory,
    categories,
}: ArticleListPageProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const isFiltered = activeCategory && activeCategory !== "All" && activeCategory !== "all";
    const activeCategoryTitle = isFiltered
        ? (categories.find((c) => c.slug === activeCategory)?.title ?? activeCategory)
        : null;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-5">
            {/* Page header */}
            <div className="bg-tint-cream rounded-2xl px-8 py-7">
                <p className="text-xs font-medium uppercase tracking-[0.28px] text-steel mb-3">
                    Insights &amp; Expertise
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-snug text-ink mb-2">Articles</h1>
                <p className="text-sm text-slate">
                    Expert perspectives from CAs, tax analysts, lawyers, and business founders.
                </p>
            </div>

            {/* Category filters */}
            <ArticleFilters categories={categories} activeCategory={activeCategory} />

            {/* Result count */}
            {total > 0 && (
                <p className="text-xs text-stone">
                    {total} article{total !== 1 ? "s" : ""}
                    {activeCategoryTitle ? ` in ${activeCategoryTitle}` : ""}
                </p>
            )}

            {/* Article grid */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-surface flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-stone" />
                    </div>
                    <p className="text-sm font-medium text-ink">No articles found</p>
                    <p className="text-xs text-stone">Try a different category</p>
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
