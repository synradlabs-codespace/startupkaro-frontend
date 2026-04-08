// app/(marketing)/services/[slug]/page.tsx

import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/features/marketing/components/ServiceDetailPage";
import { getServiceBySlug, getAllServices } from "@/features/marketing/data/services.service";

export async function generateStaticParams() {
    const services = await getAllServices();
    return services.map((s) => ({ slug: s.slug }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) notFound();

    return <ServiceDetailPage service={service} />;
}
