// app/admin/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="h-screen overflow-hidden">
            <AdminSidebar />
            <SidebarInset className="overflow-y-auto">
                <div className="flex flex-col min-h-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}