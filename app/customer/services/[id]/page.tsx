// app/customer/services/[id]/page.tsx

import { CustomerServiceDetailPage } from "@/features/customers/components/CustomerServiceDetailPage";


export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CustomerServiceDetailPage id={id} />;
}