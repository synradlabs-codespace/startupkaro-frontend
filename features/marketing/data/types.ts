// features/marketing/data/types.ts

export interface ServiceFeature {
    title: string;
    description?: string;
}

export interface ServiceProcessStep {
    step: number;
    title: string;
    description: string;
}

export interface ServiceFAQ {
    question: string;
    answer: string;
}

export interface ServicePricing {
    amount: number;
    currency: "INR";
    note?: string;
}

export interface Service {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    category: "Tax" | "Business" | "Legal" | "License";
    duration: string;
    pricing: ServicePricing;
    overview: string;
    features: ServiceFeature[];
    process: ServiceProcessStep[];
    faqs: ServiceFAQ[];
}
