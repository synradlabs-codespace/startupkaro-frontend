export interface BackendService {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category?: "bundles" | "start" | "manage" | "protect" | BackendServiceCategory | string | null;
    type?: "fixed" | "bundle" | "quote" | string;
    isBundle?: boolean;
    isPurchasable?: boolean;
    price: number | null; // paise
    priceLabel?: string | null;
    cta?: "fixed" | "buy" | "quote" | string | null;
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
    const categoryValue = typeof raw.category === "string" ? raw.category : raw.category?.slug ?? category?.slug ?? null;
    const typeValue = raw.type ?? (raw.isBundle ? "bundle" : undefined);
    const isBundle = Boolean(raw.isBundle) || categoryValue === "bundles" || typeValue === "bundle";
    const cta = raw.cta === "buy" ? "fixed" : raw.cta;
    return {
        ...raw,
        description: raw.description ?? "",
        category: categoryValue,
        type: typeValue,
        cta,
        isBundle: Boolean(isBundle),
        isPurchasable: raw.isPurchasable ?? Boolean(raw.price != null && (cta === "fixed" || typeValue === "fixed" || typeValue === "bundle")),
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
