// features/customers/components/CustomerLayoutShell.tsx
//
// Client-side shell for the customer panel layout. Split out of
// app/customer/layout.tsx so that file can stay a Server Component and
// export `noindex` metadata — a "use client" layout cannot export metadata.

"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customers/components/CustomerSidebar";
import { RoleGuard } from "@/components/custom/RoleGuard";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomerProfileGate } from "@/features/customers/components/CustomerProfileGate";
import { CustomerCartDock } from "@/features/customers/components/CustomerCartDock";

const COMPLETE_PROFILE_ROUTE = "/customer/complete-profile";

export function CustomerLayoutShell({ children }: { children: React.ReactNode }) {
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
                                    <CustomerCartDock />
                                </SidebarProvider>
                            )}
                        </CustomerProfileGate>
                    </RoleGuard>
                </TooltipProvider>
            </ToastProvider>
        </QueryProvider>
    );
}
