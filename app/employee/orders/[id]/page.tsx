// app/employee/orders/[id]/page.tsx

import { EmployeeOrderDetailPage } from "@/features/employee/components/EmployeeOrderDetailPage";

export default async function EmployeeOrderDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EmployeeOrderDetailPage id={id} />;
}