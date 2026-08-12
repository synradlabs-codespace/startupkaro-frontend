import type { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { getActiveServiceContent } from "@/features/services/api/services.content";
import { getBackendServices } from "@/features/services/api/services.backend";
import { getBundles, mergeForMarketing } from "@/features/services/lib/merge";
import { BundlesListingPage } from "@/features/marketing/components/BundlesListingPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Bundles",
    description: "Fixed-price packages that combine the registrations founders commonly need at launch.",
    path: "/bundles",
});

export default async function BundlesPage() {
    const [content, backend] = await Promise.all([
        getActiveServiceContent(),
        getBackendServices(),
    ]);
    const bundles = getBundles(mergeForMarketing(content, backend));

    return (
        <>
            <BundlesListingPage bundles={bundles} />
            <SanityLive />
        </>
    );
}
