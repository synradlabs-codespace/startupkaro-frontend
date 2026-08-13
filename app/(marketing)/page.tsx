// app/(marketing)/page.tsx

import type { Metadata } from "next";
import { LandingPage } from "@/features/marketing/components/LandingPage";
import { organizationJsonLd, websiteJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { landingFaqItems } from "@/features/marketing/data/landing-faq.data";

// Root layout already provides the site-wide default title/description/OG/Twitter
// tags for "/". This only adds the canonical, which the layout does not set.
export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

export default function Home() {
    return (
        <>
            <JsonLd data={organizationJsonLd()} />
            <JsonLd data={websiteJsonLd()} />
            <JsonLd data={faqPageJsonLd(landingFaqItems)} />
            <LandingPage />
        </>
    );
}
