// features/employee/components/EmployeeSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    MessageSquare,
    LogOut,
    ChevronRight,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
    {
        title: "Dashboard",
        href: "/employee",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        title: "Orders",
        href: "/employee/orders",
        icon: ShoppingCart,
    },
    {
        title: "Customers",
        href: "/employee/customers",
        icon: Users,
    },
    {
        title: "Inquiries",
        href: "/employee/inquiries",
        icon: MessageSquare,
    },
];

export function EmployeeSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="pb-0">
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-indigo)]">
                        <span className="text-xs font-bold text-white">SK</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">StartupKaro</p>
                        <p className="text-xs text-muted-foreground">Employee Panel</p>
                    </div>
                </div>
                <Separator />
            </SidebarHeader>

            <SidebarContent className="pt-2">
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    isActive={isActive(item.href, item.exact)}
                                    tooltip={item.title}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Separator />
                <div className="flex items-center gap-3 px-2 py-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[var(--color-indigo)] text-white text-xs">
                            EM
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Employee</p>
                        <p className="text-xs text-muted-foreground truncate">employee@startupkaro.com</p>
                    </div>
                    <Link href="/employee/login">
                        <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}