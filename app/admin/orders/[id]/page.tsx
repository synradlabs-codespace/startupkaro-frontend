// app/admin/orders/[id]/page.tsx

import { AdminOrderDetailPage } from "@/features/admin/components/AdminOrderDetailPage";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    return <AdminOrderDetailPage id={params.id} />;
}