// app/employee/layout.tsx


import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EmployeeSidebar } from "@/features/employee/components/EmployeeSidebar";
import { RoleGuard } from "@/components/custom/RoleGuard";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NOINDEX } from "@/lib/seo/site";

export const metadata: Metadata = NOINDEX;

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <ToastProvider>
                <TooltipProvider>
                    <RoleGuard requiredRole="employee">
                        <SidebarProvider className="h-screen overflow-hidden bg-canvas text-ink">
                            <EmployeeSidebar />
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
