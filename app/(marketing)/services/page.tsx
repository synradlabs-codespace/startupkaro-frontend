// app/(marketing)/services/page.tsx

import { SanityLive } from "@/sanity/live";
import { getActiveServiceContent } from "@/features/services/api/services.content";
import { getBackendServices } from "@/features/services/api/services.backend";
import { mergeForMarketing } from "@/features/services/lib/merge";
import { ServicesListingPage } from "@/features/marketing/components/ServicesListingPage";

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
