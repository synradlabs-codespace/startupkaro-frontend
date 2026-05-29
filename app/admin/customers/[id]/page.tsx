// app/admin/customers/[id]/page.tsx

import { AdminCustomerDetailPage } from "@/features/admin/components/AdminCustomerDetailPage";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminCustomerDetailPage id={id} />;
}