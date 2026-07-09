import type { PortableTextBlock } from "@portabletext/types";
import type { ServiceStage } from "@/lib/category-pills";

export type ServiceCategoryValue = ServiceStage;

export interface SanityImage {
    url: string;
    alt: string;
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio: number };
}

export interface ServiceProcessStep {
    title: string;
    description: string;
}

export interface ServiceFAQ {
    question: string;
    answer: string;
}

export interface ServiceFeature {
    title: string;
    description?: string;
}

// Shape returned by SERVICES_QUERY (card/list)
export interface ServiceCardContent {
    _id: string;
    name: string;
    slug: string;
    category: ServiceCategoryValue;
    stage?: ServiceStage;
    isBundle?: boolean;
    bundleInclusions?: string[];
    duration: string;
    tagline: string;
    shortDescription: string;
    heroImage?: SanityImage;
}

// Shape returned by SERVICE_BY_SLUG_QUERY (full detail)
export interface ServiceContent extends ServiceCardContent {
    overview: PortableTextBlock[];
    whatsIncluded: string[];
    process: ServiceProcessStep[];
    faqs: ServiceFAQ[];
    publishedAt: string;
}
