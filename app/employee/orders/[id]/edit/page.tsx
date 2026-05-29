// app/employee/orders/[id]/edit/page.tsx

import { EmployeeOrderEditPage } from "@/features/employee/components/EmployeeOrderEditPage";

export default async function EmployeeOrderEdit({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <EmployeeOrderEditPage id={id} />;
}
