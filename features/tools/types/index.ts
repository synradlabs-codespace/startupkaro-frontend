// features/tools/types/index.ts

import type { FaqItem } from "@/lib/seo/jsonld";

export type ToolCategory = "Tax" | "Investment" | "Loans" | "Payroll" | "Business";

export interface ToolDefinition {
    slug: string;
    /** Display name, e.g. "SIP Calculator" */
    name: string;
    category: ToolCategory;
    /** One-line card / nav description */
    shortDescription: string;
    /** Keyword-led H1 */
    h1: string;
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    keywords: string[];
    /** Server-rendered intro paragraphs under the H1 */
    intro: string[];
    formula: {
        heading: string;
        expression: string;
        legend: { symbol: string; meaning: string }[];
        explanation: string[];
    };
    example: { heading: string; steps: string[]; conclusion: string };
    /** Extra long-form sections for topical depth */
    sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
    faqs: FaqItem[];
    related: string[];
    serviceCta: { eyebrow: string; title: string; description: string; href: string; label: string };
    /** ISO date of the last content/rules review */
    lastReviewed: string;
    assumptions: string[];
}
