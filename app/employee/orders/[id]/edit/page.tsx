// app/employee/orders/[id]/edit/page.tsx

import { EmployeeOrderEditPage } from "@/features/employee/components/EmployeeOrderEditPage";

export default function EmployeeOrderEdit({ params }: { params: { id: string } }) {
    return <EmployeeOrderEditPage id={params.id} />;
}
