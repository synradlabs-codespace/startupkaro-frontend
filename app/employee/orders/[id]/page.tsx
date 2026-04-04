// app/employee/orders/[id]/page.tsx

import { EmployeeOrderDetailPage } from "@/features/employee/components/EmployeeOrderDetailPage";

export default function EmployeeOrderDetail({ params }: { params: { id: string } }) {
    return <EmployeeOrderDetailPage id={params.id} />;
}