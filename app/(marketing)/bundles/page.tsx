import { SanityLive } from "@/sanity/live";
import { getActiveServiceContent } from "@/features/services/api/services.content";
import { getBackendServices } from "@/features/services/api/services.backend";
import { getBundles, mergeForMarketing } from "@/features/services/lib/merge";
import { BundlesListingPage } from "@/features/marketing/components/BundlesListingPage";

export const metadata = {
    title: "Bundles | StartupKaro",
    description: "Fixed-price startup registration bundles from StartupKaro.",
};

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
