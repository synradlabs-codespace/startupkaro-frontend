import type { BackendService } from "@/features/services/api/services.backend";
import type { ServiceCardContent, ServiceContent, ServiceCategoryValue } from "@/features/services/types/content.types";

export interface EnrichedService {
    slug: string;
    name: string;
    category: ServiceCategoryValue | "Uncategorized";
    duration: string | null;
    /** Backend short description — used as fallback when no Sanity content */
    description: string;
    /** Price in paise. null when no backend service matches (marketing "contact us" case) */
    pricePaise: number | null;
    /** true only when a backend service exists (i.e. it is purchasable) */
    isPurchasable: boolean;
    /** Full detail content — null when no Sanity doc authored yet */
    content: ServiceContent | null;
    /** Card-level content — null when no Sanity doc authored yet */
    cardContent: ServiceCardContent | null;
}

// ─── Customer panel: backend is source of truth ───────────────────────────────
// Iterate backend services; left-join Sanity editorial by slug.
// Services with no Sanity doc show backend name/price only (graceful fallback).

export function mergeForCustomer(
    backend: BackendService[],
    content: ServiceCardContent[],
): EnrichedService[] {
    const contentMap = new Map(content.map((c) => [c.slug, c]));

    return backend.map((b) => {
        const c = contentMap.get(b.slug) ?? null;
        return {
            slug: b.slug,
            name: b.name,
            category: c?.category ?? "Uncategorized",
            duration: c?.duration ?? null,
            description: b.description,
            pricePaise: b.price,
            isPurchasable: true,
            content: null,
            cardContent: c,
        };
    });
}

export function mergeOneForCustomer(
    backend: BackendService | undefined,
    content: ServiceContent | null,
): EnrichedService | null {
    if (!backend && !content) return null;

    const slug = backend?.slug ?? content!.slug;
    return {
        slug,
        name: backend?.name ?? content!.name,
        category: content?.category ?? "Uncategorized",
        duration: content?.duration ?? null,
        description: backend?.description ?? "",
        pricePaise: backend?.price ?? null,
        isPurchasable: Boolean(backend),
        content: content,
        cardContent: content,
    };
}

// ─── Marketing: Sanity is source of truth ─────────────────────────────────────
// Iterate Sanity content; left-join backend price by slug.
// Services with no backend match render without a price/checkout CTA.

export function mergeForMarketing(
    content: ServiceCardContent[],
    backend: BackendService[],
): EnrichedService[] {
    const backendMap = new Map(backend.map((b) => [b.slug, b]));

    return content.map((c) => {
        const b = backendMap.get(c.slug) ?? null;
        return {
            slug: c.slug,
            name: c.name,
            category: c.category,
            duration: c.duration,
            description: c.shortDescription,
            pricePaise: b?.price ?? null,
            isPurchasable: Boolean(b),
            content: null,
            cardContent: c,
        };
    });
}

export function mergeOneForMarketing(
    content: ServiceContent | null,
    backend: BackendService | undefined,
): EnrichedService | null {
    if (!content) return null;

    return {
        slug: content.slug,
        name: content.name,
        category: content.category,
        duration: content.duration,
        description: content.shortDescription,
        pricePaise: backend?.price ?? null,
        isPurchasable: Boolean(backend),
        content: content,
        cardContent: content,
    };
}
