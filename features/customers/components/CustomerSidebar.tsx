"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Store,
    User,
    LogOut,
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const navItems = [
    { title: "Dashboard", href: "/customer", icon: LayoutDashboard, exact: true },
    { title: "My Purchases", href: "/customer/purchases", icon: ShoppingBag },
    { title: "Services", href: "/customer/services", icon: Store },
    { title: "Profile", href: "/customer/profile", icon: User },
];

export function CustomerSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="pb-0">
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-green)]">
                        <span className="text-xs font-bold text-white">SK</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">StartupKaro</p>
                        <p className="text-xs text-muted-foreground">Customer Portal</p>
                    </div>
                </div>
                <Separator />
            </SidebarHeader>

            <SidebarContent className="pt-2">
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                        <AvatarFallback className="bg-[var(--color-green)] text-white text-xs">
                            RS
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Rahul Sharma</p>
                        <p className="text-xs text-muted-foreground truncate">rahul@example.com</p>
                    </div>
                    <Link href="/customer/login">
                        <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}