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

// --- Article types ---

export type ArticleCategory = "Tax" | "Legal" | "Compliance" | "Startup" | "Finance" | "Business";

export interface ArticleAuthor {
    name: string;
    role: string;
    avatarUrl?: string;
    bio?: string;
}

export type ArticleBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; level: 2 | 3; text: string }
    | { type: "quote"; text: string; cite?: string }
    | { type: "list"; style: "bullet" | "number"; items: string[] }
    | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    category: ArticleCategory;
    author: ArticleAuthor;
    publishedAt: string;
    readTimeMinutes: number;
    coverImageUrl?: string;
    tags?: string[];
    body: ArticleBlock[];
    seo?: { title?: string; description?: string };
}
