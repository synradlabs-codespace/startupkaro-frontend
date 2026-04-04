// app/customer/layout.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CustomerSidebar } from "@/features/customers/components/CustomerSidebar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <CustomerSidebar />
            <SidebarInset>
                <div className="flex flex-col min-h-screen">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}