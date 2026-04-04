// app/admin/customers/[id]/orders/page.tsx

import { AdminCustomerOrdersPage } from "@/features/admin/components/AdminCustomerOrdersPage";

export default function CustomerOrdersPage({ params }: { params: { id: string } }) {
    return <AdminCustomerOrdersPage customerId={params.id} />;
}