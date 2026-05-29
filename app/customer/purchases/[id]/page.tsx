// app/customer/purchases/[id]/page.tsx

import { CustomerPurchaseDetailPage } from "@/features/customers/components/CustomerPurchaseDetailPage";

export default async function PurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CustomerPurchaseDetailPage id={id} />;
}