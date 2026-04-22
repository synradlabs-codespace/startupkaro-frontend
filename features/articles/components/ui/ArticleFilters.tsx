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
            {/* "All" chip */}
            <button
                type="button"
                onClick={() => handleCategory("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 border ${
                    isAllActive
                        ? "bg-[#FF9933] text-white border-[#FF9933] shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-[#FF9933]/40 hover:text-[#FF9933]"
                }`}
            >
                All
            </button>

            {categories.map((cat) => {
                const Icon = getIcon(cat.iconName);
                const isActive = activeCategory === cat.slug;
                const color = cat.accentColor ?? "#6B7280";
                return (
                    <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategory(cat.slug)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 border"
                        style={
                            isActive
                                ? { backgroundColor: color, color: "#fff", borderColor: color }
                                : {
                                      backgroundColor: "#fff",
                                      color: "#6B7280",
                                      borderColor: "#E5E7EB",
                                  }
                        }
                        onMouseEnter={(e) => {
                            if (!isActive) {
                                (e.currentTarget as HTMLButtonElement).style.color = color;
                                (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}66`;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive) {
                                (e.currentTarget as HTMLButtonElement).style.color = "#6B7280";
                                (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E7EB";
                            }
                        }}
                    >
                        <Icon className="h-3 w-3" />
                        {cat.title}
                    </button>
                );
            })}
        </div>
    );
}
