// features/marketing/data/services.service.ts
// NOTE: CMS swap point — replace each function body with a Sanity query
// (e.g. sanityClient.fetch(...)) without changing signatures or call sites.

import { MOCK_SERVICES } from "./services.data";
import type { Service } from "./types";

export async function getAllServices(): Promise<Service[]> {
    return MOCK_SERVICES;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
    return MOCK_SERVICES.find((s) => s.slug === slug) ?? null;
}

export async function getServicesByCategory(category: Service["category"]): Promise<Service[]> {
    return MOCK_SERVICES.filter((s) => s.category === category);
}
