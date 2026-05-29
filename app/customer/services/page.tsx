// app/customer/services/page.tsx

import { SanityLive } from "@/sanity/live";
import { getActiveServiceContent } from "@/features/services/api/services.content";
import { getBackendServices } from "@/features/services/api/services.backend";
import { mergeForCustomer } from "@/features/services/lib/merge";
import { CustomerServicesPage } from "@/features/customers/components/CustomerServicesPage";

export default async function ServicesPage() {
    const [backend, content] = await Promise.all([
        getBackendServices(),
        getActiveServiceContent(),
    ]);
    const services = mergeForCustomer(backend, content);

    return (
        <>
            <CustomerServicesPage services={services} />
            <SanityLive />
        </>
    );
}
