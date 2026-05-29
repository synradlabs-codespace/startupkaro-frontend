// app/admin/orders/[id]/edit/page.tsx

import { AdminOrderEditPage } from "@/features/admin/components/AdminOrderEditPage";

export default async function OrderEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminOrderEditPage id={id} />;
}