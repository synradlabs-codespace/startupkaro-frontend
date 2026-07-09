import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { getServiceContentBySlug } from "@/features/services/api/services.content";
import { getBackendServiceBySlug } from "@/features/services/api/services.backend";
import { mergeOneForMarketing } from "@/features/services/lib/merge";
import { ServiceDetailPage } from "@/features/marketing/components/ServiceDetailPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const [content, backend] = await Promise.all([
        getServiceContentBySlug(slug),
        getBackendServiceBySlug(slug),
    ]);
    const service = mergeOneForMarketing(content, backend);
    if (!service?.isBundle) return {};
    return {
        title: `${service.name} | StartupKaro`,
        description: service.cardContent?.tagline ?? service.description,
    };
}

export default async function BundlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [content, backend] = await Promise.all([
        getServiceContentBySlug(slug),
        getBackendServiceBySlug(slug),
    ]);

    const service = mergeOneForMarketing(content, backend);
    if (!service?.isBundle) notFound();

    return (
        <>
            <ServiceDetailPage service={service} />
            <SanityLive />
        </>
    );
}
