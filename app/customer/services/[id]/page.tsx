// app/customer/services/[id]/page.tsx
// Note: segment is named [id] but carries the service slug.

import { notFound } from "next/navigation";
import { SanityLive } from "@/sanity/live";
import { getServiceContentBySlug } from "@/features/services/api/services.content";
import { getBackendServiceBySlug } from "@/features/services/api/services.backend";
import { mergeOneForCustomer } from "@/features/services/lib/merge";
import { CustomerServiceDetailPage } from "@/features/customers/components/CustomerServiceDetailPage";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: slug } = await params;

    const [backend, content] = await Promise.all([
        getBackendServiceBySlug(slug),
        getServiceContentBySlug(slug),
    ]);

    const service = mergeOneForCustomer(backend, content);
    if (!service) notFound();

    return (
        <>
            <CustomerServiceDetailPage service={service} />
            <SanityLive />
        </>
    );
}
