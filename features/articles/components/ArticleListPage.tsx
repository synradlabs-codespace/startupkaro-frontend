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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Page header */}
            <div>
                <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-3">
                    Insights &amp; Expertise
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-normal tracking-tight leading-snug text-ink mb-2">Articles</h1>
                <p className="text-sm text-body-muted">
                    Expert perspectives from CAs, tax analysts, lawyers, and business founders.
                </p>
            </div>

            {/* Category filters */}
            <ArticleFilters categories={categories} activeCategory={activeCategory} />

            {/* Result count */}
            {total > 0 && (
                <p className="text-xs text-body-muted">
                    {total} article{total !== 1 ? "s" : ""}
                    {activeCategoryTitle ? ` in ${activeCategoryTitle}` : ""}
                </p>
            )}

            {/* Article grid */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-soft-stone flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-body-muted" />
                    </div>
                    <p className="text-sm font-medium text-ink">No articles found</p>
                    <p className="text-xs text-body-muted">Try a different category</p>
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
