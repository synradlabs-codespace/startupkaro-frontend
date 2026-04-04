// app/employee/layout.tsx


import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EmployeeSidebar } from "@/features/employee/components/EmployeeSidebar";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <EmployeeSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}