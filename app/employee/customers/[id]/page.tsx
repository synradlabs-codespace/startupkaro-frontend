// app/employee/customers/[id]/page.tsx

import { EmployeeCustomerDetailPage } from "@/features/employee/components/EmployeeCustomerDetailPage";

export default function EmployeeCustomerDetail({ params }: { params: { id: string } }) {
    return <EmployeeCustomerDetailPage id={params.id} />;
}