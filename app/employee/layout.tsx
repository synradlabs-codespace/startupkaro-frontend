// app/employee/layout.tsx


import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EmployeeSidebar } from "@/features/employee/components/EmployeeSidebar";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="h-screen overflow-hidden">
            <EmployeeSidebar />
            <SidebarInset className="overflow-y-auto">
                <div className="flex flex-col min-h-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}