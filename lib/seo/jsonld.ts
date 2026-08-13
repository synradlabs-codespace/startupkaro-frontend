// lib/seo/jsonld.ts
//
// Structured data (schema.org) builders. Each function returns a plain object
// ready to hand to <JsonLd data={...} /> (components/seo/JsonLd.tsx).
//
// Known gaps in this markup are tracked in docs/SEO_CAVEATS.md. Read that
// file before "fixing" a validator warning here; some are accepted tradeoffs.

import { absoluteUrl, ORG, SITE_LEGAL_NAME, SITE_NAME, SITE_URL } from "./site";
import { sanitizeSeoText } from "./text";

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_LEGAL_NAME,
        alternateName: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl(ORG.logo),
        sameAs: [...ORG.socials],
        contactPoint: [
            {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: ORG.email,
                telephone: ORG.phones[0],
                areaServed: "IN",
                availableLanguage: ["en"],
            },
        ],
        address: {
            "@type": "PostalAddress",
            addressLocality: ORG.address.locality,
            addressRegion: ORG.address.region,
            addressCountry: ORG.address.country,
        },
    };
}

export function websiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
    };
}

export interface FaqItem {
    question: string;
    /** Plain-text answer. Strip any markup before passing it here. */
    answer: string;
}

export function faqPageJsonLd(items: FaqItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: sanitizeSeoText(item.question),
            acceptedAnswer: { "@type": "Answer", text: sanitizeSeoText(item.answer) },
        })),
    };
}

export interface ArticleJsonLdInput {
    title: string;
    description: string;
    path: string;
    imageUrl: string;
    publishedAt: string;
    updatedAt?: string;
    authorName: string;
    authorTitle?: string;
}

export function articleJsonLd(input: ArticleJsonLdInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: sanitizeSeoText(input.title),
        description: sanitizeSeoText(input.description),
        image: [input.imageUrl],
        datePublished: input.publishedAt,
        dateModified: input.updatedAt ?? input.publishedAt,
        author: {
            "@type": "Person",
            name: sanitizeSeoText(input.authorName),
            ...(input.authorTitle ? { jobTitle: sanitizeSeoText(input.authorTitle) } : {}),
        },
        publisher: {
            "@type": "Organization",
            name: SITE_LEGAL_NAME,
            logo: { "@type": "ImageObject", url: absoluteUrl(ORG.logo) },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    };
}

export interface JobPostingJsonLdInput {
    title: string;
    description: string;
    path: string;
    datePosted: string;
    employmentType: "FULL_TIME" | "INTERN";
    location: string;
    isRemote: boolean;
}

/**
 * Missing `validThrough` and `baseSalary`. The Sanity `job` schema has
 * neither field today. Markup stays valid and Google-Jobs-eligible, just
 * weaker. See docs/SEO_CAVEATS.md.
 */
export function jobPostingJsonLd(input: JobPostingJsonLdInput) {
    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: sanitizeSeoText(input.title),
        description: sanitizeSeoText(input.description),
        identifier: {
            "@type": "PropertyValue",
            name: SITE_NAME,
            value: absoluteUrl(input.path),
        },
        datePosted: input.datePosted,
        employmentType: input.employmentType,
        hiringOrganization: {
            "@type": "Organization",
            name: SITE_LEGAL_NAME,
            sameAs: SITE_URL,
            logo: absoluteUrl(ORG.logo),
        },
        ...(input.isRemote
            ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } }
            : {
                  jobLocation: {
                      "@type": "Place",
                      address: {
                          "@type": "PostalAddress",
                          addressLocality: sanitizeSeoText(input.location),
                          addressCountry: "IN",
                      },
                  },
              }),
    };
}

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: sanitizeSeoText(item.name),
            item: absoluteUrl(item.path),
        })),
    };
}
