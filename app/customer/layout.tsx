// app/customer/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customers/components/CustomerSidebar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="h-screen overflow-hidden">
            <CustomerSidebar />
            <SidebarInset className="overflow-y-auto">
                <div className="flex flex-col min-h-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}