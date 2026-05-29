// app/(marketing)/services/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { getAllServiceSlugs, getServiceContentBySlug } from "@/features/services/api/services.content";
import { getBackendServiceBySlug } from "@/features/services/api/services.backend";
import { mergeOneForMarketing } from "@/features/services/lib/merge";
import { ServiceDetailPage } from "@/features/marketing/components/ServiceDetailPage";

export async function generateStaticParams() {
    const slugs = await getAllServiceSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const content = await getServiceContentBySlug(slug);
    if (!content) return {};
    return {
        title: `${content.name} | StartupKaro`,
        description: content.tagline,
    };
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

    return (
        <>
            <ServiceDetailPage service={service} />
            <SanityLive />
        </>
    );
}
