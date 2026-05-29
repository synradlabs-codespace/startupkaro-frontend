// app/admin/orders/[id]/page.tsx

import { AdminOrderDetailPage } from "@/features/admin/components/AdminOrderDetailPage";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminOrderDetailPage id={id} />;
}