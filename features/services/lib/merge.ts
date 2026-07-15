import type { BackendBundleItem, BackendService, BackendServiceAddon } from "@/features/services/api/services.backend";
import type { ServiceCardContent, ServiceContent, ServiceCategoryValue } from "@/features/services/types/content.types";
import { inferServiceStage, type ServiceStage } from "@/lib/category-pills";

export type ServiceCta = "buy" | "quote";

export interface EnrichedService {
    id?: string;
    slug: string;
    name: string;
    category: ServiceCategoryValue | "Uncategorized";
    stage: ServiceStage;
    backendCategory: { id: string; name: string; slug: string } | null;
    duration: string | null;
    description: string;
    pricePaise: number | null;
    priceLabel: string | null;
    pricingType: string | null;
    billingCycle: string | null;
    cta: ServiceCta;
    isBundle: boolean;
    isPurchasable: boolean;
    items: BackendBundleItem[];
    addons: BackendServiceAddon[];
    content: ServiceContent | null;
    cardContent: ServiceCardContent | null;
}

function normalizeCta(service?: BackendService | null): ServiceCta {
    if (!service) return "quote";
    if ((service.cta === "fixed" || service.cta === "buy" || service.type === "fixed" || service.type === "bundle") && service.isPurchasable !== false) return "buy";
    return "quote";
}

function stageFor(backend?: BackendService | null, content?: ServiceCardContent | null): ServiceStage {
    const backendCategory = typeof backend?.category === "string" ? backend.category : backend?.category?.slug;
    return content?.stage ?? content?.category ?? inferServiceStage({
        name: backend?.name ?? content?.name,
        slug: backend?.slug ?? content?.slug,
        categorySlug: backendCategory,
        categoryName: backendCategory,
        isBundle: Boolean(backend?.isBundle || backend?.type === "bundle" || backendCategory === "bundles" || content?.isBundle),
    });
}

function enrichFromBackend(backend: BackendService, content: ServiceCardContent | ServiceContent | null): EnrichedService {
    const stage = stageFor(backend, content);
    const backendCategory = typeof backend.category === "string" ? backend.category : backend.category?.slug;
    const cta = normalizeCta(backend);

    return {
        id: backend.id,
        slug: backend.slug,
        name: backend.name,
        category: content?.category ?? stage,
        stage,
        backendCategory: null,
        duration: content?.duration ?? null,
        description: content?.shortDescription ?? backend.description ?? "",
        pricePaise: backend.price ?? null,
        priceLabel: backend.priceLabel ?? null,
        pricingType: backend.type ?? null,
        billingCycle: null,
        cta,
        isBundle: Boolean(backend.isBundle || backend.type === "bundle" || backendCategory === "bundles" || content?.isBundle),
        isPurchasable: backend.isPurchasable ?? (cta === "buy"),
        items: backend.items ?? [],
        addons: backend.addons ?? [],
        content: "overview" in (content ?? {}) ? (content as ServiceContent) : null,
        cardContent: content,
    };
}

function enrichFromContent(content: ServiceCardContent | ServiceContent, backend?: BackendService | null): EnrichedService {
    if (backend) return enrichFromBackend(backend, content);

    const stage = stageFor(null, content);
    return {
        slug: content.slug,
        name: content.name,
        category: content.category ?? stage,
        stage,
        backendCategory: null,
        duration: content.duration,
        description: content.shortDescription,
        pricePaise: null,
        priceLabel: null,
        pricingType: null,
        billingCycle: null,
        cta: "quote",
        isBundle: Boolean(content.isBundle),
        isPurchasable: false,
        items: (content.bundleInclusions ?? []).map((label, index) => ({ id: `${content.slug}-${index}`, label, sortOrder: index })),
        addons: [],
        content: "overview" in content ? content : null,
        cardContent: content,
    };
}

// Customer panel: backend is source of truth.
export function mergeForCustomer(
    backend: BackendService[],
    content: ServiceCardContent[],
): EnrichedService[] {
    const contentMap = new Map(content.map((c) => [c.slug, c]));
    return backend.map((b) => enrichFromBackend(b, contentMap.get(b.slug) ?? null));
}

export function mergeOneForCustomer(
    backend: BackendService | undefined,
    content: ServiceContent | null,
): EnrichedService | null {
    if (!backend && !content) return null;
    return backend ? enrichFromBackend(backend, content) : enrichFromContent(content!);
}

// Marketing: show authored Sanity services first, then backend-only services.
export function mergeForMarketing(
    content: ServiceCardContent[],
    backend: BackendService[],
): EnrichedService[] {
    const backendMap = new Map(backend.map((b) => [b.slug, b]));
    const contentSlugs = new Set(content.map((c) => c.slug));

    const authored = content.map((c) => enrichFromContent(c, backendMap.get(c.slug)));
    const backendOnly = backend
        .filter((b) => !contentSlugs.has(b.slug))
        .map((b) => enrichFromBackend(b, null));

    return [...authored, ...backendOnly];
}

export function mergeOneForMarketing(
    content: ServiceContent | null,
    backend: BackendService | undefined,
): EnrichedService | null {
    if (!content && !backend) return null;
    return backend ? enrichFromBackend(backend, content) : enrichFromContent(content!);
}

export function getBundles(services: EnrichedService[]): EnrichedService[] {
    return services.filter((service) => service.isBundle);
}

export function getStandaloneServices(services: EnrichedService[]): EnrichedService[] {
    return services.filter((service) => !service.isBundle);
}
