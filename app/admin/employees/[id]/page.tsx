// app/admin/employees/[id]/page.tsx

import { AdminEmployeeDetailPage } from "@/features/admin/components/AdminEmployeeDetailPage";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminEmployeeDetailPage id={id} />;
}