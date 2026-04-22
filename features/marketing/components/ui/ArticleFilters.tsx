// features/marketing/components/ui/ArticleFilters.tsx

"use client";

import { useRouter } from "next/navigation";

const CATEGORIES = ["All", "Tax", "Legal", "Compliance", "Startup", "Finance", "Business"] as const;

export function ArticleFilters({ activeCategory }: { activeCategory: string }) {
    const router = useRouter();

    function handleCategory(cat: string) {
        const params = new URLSearchParams();
        if (cat !== "All") params.set("category", cat);
        const queryString = params.toString();
        router.push(`/article${queryString ? `?${queryString}` : ""}`);
    }

    return (
        <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 border ${
                        activeCategory === cat
                            ? "bg-[#FF9933] text-white border-[#FF9933] shadow-sm"
                            : "bg-white text-gray-500 border-gray-200 hover:border-[#FF9933]/40 hover:text-[#FF9933]"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
