// app/customer/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customers/components/CustomerSidebar";
import { RoleGuard } from "@/components/custom/RoleGuard";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <ToastProvider>
                <TooltipProvider>
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
                </TooltipProvider>
            </ToastProvider>
        </QueryProvider>
    );
}
