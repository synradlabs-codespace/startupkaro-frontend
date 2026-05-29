// app/employee/customers/[id]/page.tsx

import { EmployeeCustomerDetailPage } from "@/features/employee/components/EmployeeCustomerDetailPage";

export default async function EmployeeCustomerDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EmployeeCustomerDetailPage id={id} />;
}