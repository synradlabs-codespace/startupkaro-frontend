import { sanityFetch } from "@/sanity/live";
import { CATEGORIES_QUERY } from "@/sanity/queries";
import type { Category } from "@/features/articles/types";

export async function getAllCategories(): Promise<Category[]> {
    const result = await sanityFetch({
        query: CATEGORIES_QUERY,
        tags: ["category"],
    });
    return (result.data ?? []) as Category[];
}
