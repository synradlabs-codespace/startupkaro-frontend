export interface BackendService {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categoryId?: string | null;
    category?: BackendServiceCategory | null;
    pricingType?: "fixed" | "quote" | "starting_from" | "recurring" | "per_unit" | string;
    billingCycle?: "one_time" | "monthly" | "hourly" | "per_application" | string;
    isBundle?: boolean;
    isPurchasable?: boolean;
    price: number | null; // paise
    priceLabel?: string | null;
    cta?: "buy" | "quote" | "subscribe" | string | null;
    pricing?: {
        base: number;
        tax: number;
        total: number;
        taxRatePct: number;
    } | null;
    items?: BackendBundleItem[];
    addons?: BackendServiceAddon[];
    plan?: unknown;
}

export interface BackendServiceCategory {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    services?: BackendService[];
}

export interface BackendBundleItem {
    id: string;
    label: string;
    componentServiceId?: string | null;
    componentSlug?: string | null;
    sortOrder?: number;
}

export interface BackendServiceAddon {
    id: string;
    name: string;
    description?: string | null;
    price: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function normalizeService(raw: BackendService, category?: BackendServiceCategory): BackendService {
    return {
        ...raw,
        description: raw.description ?? "",
        categoryId: raw.categoryId ?? category?.id ?? raw.category?.id ?? null,
        category: raw.category ?? (category ? { id: category.id, name: category.name, slug: category.slug, parentId: category.parentId } : null),
        cta: raw.cta === "subscribe" ? "quote" : raw.cta,
        isBundle: Boolean(raw.isBundle),
        isPurchasable: raw.isPurchasable ?? Boolean(raw.price != null && raw.cta !== "quote" && raw.cta !== "subscribe"),
        items: raw.items ?? [],
        addons: raw.addons ?? [],
    };
}

export function flattenBackendServices(payload: unknown): BackendService[] {
    const data = payload as BackendService[] | BackendServiceCategory[] | null | undefined;
    if (!Array.isArray(data)) return [];

    const services: BackendService[] = [];
    for (const item of data) {
        const maybeCategory = item as BackendServiceCategory;
        if (Array.isArray(maybeCategory.services)) {
            services.push(...maybeCategory.services.map((service) => normalizeService(service, maybeCategory)));
        } else {
            services.push(normalizeService(item as BackendService));
        }
    }
    return services;
}

export async function getBackendServices(): Promise<BackendService[]> {
    try {
        const res = await fetch(`${API_URL}/customer/services`, {
            next: { revalidate: 300, tags: ["backend-service"] },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return flattenBackendServices(json?.data);
    } catch {
        return [];
    }
}

export async function getBackendServiceBySlug(slug: string): Promise<BackendService | undefined> {
    try {
        const res = await fetch(`${API_URL}/customer/services/${slug}`, {
            next: { revalidate: 300, tags: ["backend-service", `backend-service:${slug}`] },
        });
        if (!res.ok) return undefined;
        const json = await res.json();
        return normalizeService(json?.data as BackendService);
    } catch {
        const services = await getBackendServices();
        return services.find((s) => s.slug === slug);
    }
}
