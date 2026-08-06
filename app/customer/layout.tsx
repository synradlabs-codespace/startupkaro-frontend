// app/customer/layout.tsx

"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customers/components/CustomerSidebar";
import { RoleGuard } from "@/components/custom/RoleGuard";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomerProfileGate } from "@/features/customers/components/CustomerProfileGate";

const COMPLETE_PROFILE_ROUTE = "/customer/complete-profile";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isCompleteProfileRoute = pathname === COMPLETE_PROFILE_ROUTE;

    return (
        <QueryProvider>
            <ToastProvider>
                <TooltipProvider>
                    <RoleGuard requiredRole="customer">
                        <CustomerProfileGate>
                            {isCompleteProfileRoute ? (
                                children
                            ) : (
                                <SidebarProvider className="h-screen overflow-hidden bg-canvas text-ink">
                                    <CustomerSidebar />
                                    <SidebarInset className="overflow-y-auto bg-canvas">
                                        <div className="flex flex-col min-h-full">
                                            {children}
                                        </div>
                                    </SidebarInset>
                                </SidebarProvider>
                            )}
                        </CustomerProfileGate>
                    </RoleGuard>
                </TooltipProvider>
            </ToastProvider>
        </QueryProvider>
    );
}
