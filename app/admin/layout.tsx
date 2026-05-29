// app/admin/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { RoleGuard } from "@/components/custom/RoleGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard requiredRole="admin">
            <SidebarProvider className="h-screen overflow-hidden bg-canvas text-ink">
                <AdminSidebar />
                <SidebarInset className="overflow-y-auto bg-canvas">
                    <div className="flex flex-col min-h-full">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RoleGuard>
    );
}
