// app/admin/orders/[id]/edit/page.tsx

import { AdminOrderEditPage } from "@/features/admin/components/AdminOrderEditPage";

export default function OrderEditPage({ params }: { params: { id: string } }) {
    return <AdminOrderEditPage id={params.id} />;
}