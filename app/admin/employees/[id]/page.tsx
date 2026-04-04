// app/admin/employees/[id]/page.tsx

import { AdminEmployeeDetailPage } from "@/features/admin/components/AdminEmployeeDetailPage";

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
    return <AdminEmployeeDetailPage id={params.id} />;
}