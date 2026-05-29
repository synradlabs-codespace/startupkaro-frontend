// app/customer/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customers/components/CustomerSidebar";
import { RoleGuard } from "@/components/custom/RoleGuard";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard requiredRole="customer">
            <SidebarProvider className="h-screen overflow-hidden bg-canvas text-ink">
                <CustomerSidebar />
                <SidebarInset className="overflow-y-auto bg-canvas">
                    <div className="flex flex-col min-h-full">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RoleGuard>
    );
}
