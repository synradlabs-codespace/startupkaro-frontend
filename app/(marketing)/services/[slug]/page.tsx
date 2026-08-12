// app/(marketing)/services/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { getAllServiceSlugs, getServiceContentBySlug } from "@/features/services/api/services.content";
import { getBackendServiceBySlug } from "@/features/services/api/services.backend";
import { mergeOneForMarketing } from "@/features/services/lib/merge";
import { ServiceDetailPage } from "@/features/marketing/components/ServiceDetailPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { NOINDEX } from "@/lib/seo/site";
import { breadcrumbListJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateStaticParams() {
    const slugs = await getAllServiceSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const content = await getServiceContentBySlug(slug);
    if (!content) return NOINDEX;
    return buildMetadata({
        title: content.name,
        description: content.tagline,
        path: `/services/${slug}`,
        ogLabel: "Services",
    });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [content, backend] = await Promise.all([
        getServiceContentBySlug(slug),
        getBackendServiceBySlug(slug),
    ]);

    // Sanity is source of truth for marketing showcase
    const service = mergeOneForMarketing(content, backend);
    if (!service) notFound();

    const faqs = service.content?.faqs ?? [];

    return (
        <>
            {faqs.length > 0 && <JsonLd data={faqPageJsonLd(faqs)} />}
            <JsonLd
                data={breadcrumbListJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Services", path: "/services" },
                    { name: service.name, path: `/services/${slug}` },
                ])}
            />
            <ServiceDetailPage service={service} />
            <SanityLive />
        </>
    );
}
