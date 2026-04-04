// app/admin/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}