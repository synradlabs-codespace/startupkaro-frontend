import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"

export default function DashboardLayout({
    children,
    role,
}: {
    children: React.ReactNode
    role: "admin" | "employee"
}) {
    return (
        <div className="flex">
            <DashboardSidebar role={role} />

            <div className="flex-1 min-h-screen bg-gray-50">
                <DashboardHeader role={role} />
                <main className="p-6">{children}</main>
            </div>
        </div>
    )
}