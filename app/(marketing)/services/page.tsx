// app/(marketing)/services/page.tsx

import type { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { getActiveServiceContent } from "@/features/services/api/services.content";
import { getBackendServices } from "@/features/services/api/services.backend";
import { mergeForMarketing } from "@/features/services/lib/merge";
import { ServicesListingPage } from "@/features/marketing/components/ServicesListingPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Our Services",
    description: "Startup compliance, legal, and tech services handled end-to-end by CAs, CSs, lawyers, and software engineers.",
    path: "/services",
});

export default async function ServicesPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;

    const [content, backend] = await Promise.all([
        getActiveServiceContent(),
        getBackendServices(),
    ]);
    const services = mergeForMarketing(content, backend);

    return (
        <>
            <ServicesListingPage services={services} initialCategory={category} />
            <SanityLive />
        </>
    );
}
