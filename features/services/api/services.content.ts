import { sanityFetch } from "@/sanity/live";
import { client } from "@/sanity/client";
import { SERVICES_QUERY, SERVICE_BY_SLUG_QUERY, ALL_SERVICE_SLUGS_QUERY } from "@/sanity/queries";
import type { ServiceCardContent, ServiceContent } from "@/features/services/types/content.types";

export async function getActiveServiceContent(): Promise<ServiceCardContent[]> {
    const result = await sanityFetch({
        query: SERVICES_QUERY,
        tags: ["service"],
    });
    return (result.data ?? []) as ServiceCardContent[];
}

export async function getServiceContentBySlug(slug: string): Promise<ServiceContent | null> {
    const result = await sanityFetch({
        query: SERVICE_BY_SLUG_QUERY,
        params: { slug },
        tags: ["service", `service:${slug}`],
    });
    return (result.data ?? null) as ServiceContent | null;
}

// Uses plain client — safe for generateStaticParams (no draftMode() call)
export async function getAllServiceSlugs(): Promise<{ slug: string }[]> {
    const data = await client.fetch(ALL_SERVICE_SLUGS_QUERY);
    return (data ?? []) as { slug: string }[];
}
