// features/marketing/components/ui/ArticlePagination.tsx

"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ArticlePaginationProps {
    page: number;
    totalPages: number;
    activeCategory: string;
}

export function ArticlePagination({ page, totalPages, activeCategory }: ArticlePaginationProps) {
    const router = useRouter();

    if (totalPages <= 1) return null;

    function go(newPage: number) {
        const params = new URLSearchParams();
        if (activeCategory !== "All") params.set("category", activeCategory);
        if (newPage > 1) params.set("page", String(newPage));
        const queryString = params.toString();
        router.push(`/article${queryString ? `?${queryString}` : ""}`);
    }

    function getPages(): (number | "...")[] {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
        if (page >= totalPages - 3)
            return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "...", page - 1, page, page + 1, "...", totalPages];
    }

    return (
        <div className="flex items-center justify-center gap-1.5">
            <button
                type="button"
                onClick={() => go(page - 1)}
                disabled={page <= 1}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#FF9933]/40 hover:text-[#FF9933] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {getPages().map((p, i) =>
                p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-sm text-gray-400">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        onClick={() => go(p as number)}
                        className={`h-8 min-w-[2rem] px-2.5 inline-flex items-center justify-center rounded-xl text-xs font-medium border transition-colors ${
                            p === page
                                ? "bg-[#FF9933] text-white border-[#FF9933] shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#FF9933]/40 hover:text-[#FF9933]"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                onClick={() => go(page + 1)}
                disabled={page >= totalPages}
                className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#FF9933]/40 hover:text-[#FF9933] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}
