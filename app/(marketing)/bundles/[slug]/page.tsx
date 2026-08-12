import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { getServiceContentBySlug } from "@/features/services/api/services.content";
import { getBackendServiceBySlug } from "@/features/services/api/services.backend";
import { mergeOneForMarketing } from "@/features/services/lib/merge";
import { ServiceDetailPage } from "@/features/marketing/components/ServiceDetailPage";
import { buildMetadata } from "@/lib/seo/metadata";
import { NOINDEX } from "@/lib/seo/site";
import { breadcrumbListJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const [content, backend] = await Promise.all([
        getServiceContentBySlug(slug),
        getBackendServiceBySlug(slug),
    ]);
    const service = mergeOneForMarketing(content, backend);
    if (!service?.isBundle) return NOINDEX;
    return buildMetadata({
        title: service.name,
        description: service.cardContent?.tagline ?? service.description,
        path: `/bundles/${slug}`,
        ogLabel: "Bundles",
    });
}

export default async function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [content, backend] = await Promise.all([
        getServiceContentBySlug(slug),
        getBackendServiceBySlug(slug),
    ]);

    const service = mergeOneForMarketing(content, backend);
    if (!service?.isBundle) notFound();

    const faqs = service.content?.faqs ?? [];

    return (
        <>
            {faqs.length > 0 && <JsonLd data={faqPageJsonLd(faqs)} />}
            <JsonLd
                data={breadcrumbListJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Bundles", path: "/bundles" },
                    { name: service.name, path: `/bundles/${slug}` },
                ])}
            />
            <ServiceDetailPage service={service} />
            <SanityLive />
        </>
    );
}
