// app/admin/customers/[id]/page.tsx

import { AdminCustomerDetailPage } from "@/features/admin/components/AdminCustomerDetailPage";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    return <AdminCustomerDetailPage id={params.id} />;
}