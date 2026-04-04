// app/customer/services/[id]/page.tsx

import { CustomerServiceDetailPage } from "@/features/customers/components/CustomerServiceDetailPage";


export default function ServiceDetailPage({ params }: { params: { id: string } }) {
    return <CustomerServiceDetailPage id={params.id} />;
}