// app/customer/purchases/[id]/page.tsx

import { CustomerPurchaseDetailPage } from "@/features/customers/components/CustomerPurchaseDetailPage";

export default function PurchaseDetailPage({ params }: { params: { id: string } }) {
    return <CustomerPurchaseDetailPage id={params.id} />;
}