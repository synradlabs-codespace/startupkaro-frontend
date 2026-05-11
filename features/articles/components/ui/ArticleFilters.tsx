// features/articles/components/ui/ArticleFilters.tsx

"use client";

import { useRouter } from "next/navigation";
import { getIcon } from "@/features/articles/lib/icon-map";
import type { Category } from "@/features/articles/types";

interface ArticleFiltersProps {
    categories: Category[];
    activeCategory: string;
}

export function ArticleFilters({ categories, activeCategory }: ArticleFiltersProps) {
    const router = useRouter();

    function handleCategory(slug: string) {
        const params = new URLSearchParams();
        if (slug !== "all") params.set("category", slug);
        const queryString = params.toString();
        router.push(`/article${queryString ? `?${queryString}` : ""}`);
    }

    const isAllActive = activeCategory === "All" || activeCategory === "all" || !activeCategory;

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                type="button"
                onClick={() => handleCategory("all")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 border ${
                    isAllActive
                        ? "bg-primary-brand text-white border-primary-brand"
                        : "bg-canvas text-slate border-hairline hover:border-hairline-strong hover:text-ink"
                }`}
            >
                All
            </button>

            {categories.map((cat) => {
                const Icon = getIcon(cat.iconName);
                const isActive = activeCategory === cat.slug;
                return (
                    <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategory(cat.slug)}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 border ${
                            isActive
                                ? "bg-primary-brand text-white border-primary-brand"
                                : "bg-canvas text-slate border-hairline hover:border-hairline-strong hover:text-ink"
                        }`}
                    >
                        <Icon className="h-3 w-3" />
                        {cat.title}
                    </button>
                );
            })}
        </div>
    );
}
