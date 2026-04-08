// app/(marketing)/services/page.tsx

import { ServicesListingPage } from "@/features/marketing/components/ServicesListingPage";
import { getAllServices } from "@/features/marketing/data/services.service";

export default async function ServicesPage() {
    const services = await getAllServices();
    return <ServicesListingPage services={services} />;
}
