// features/admin/components/AdminSideBar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    CreditCard,
    Users,
    UserCog,
    MessageSquare,
    BarChart3,
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
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        children: [
            { title: "All Orders", href: "/admin/orders" },
            { title: "New Order", href: "/admin/orders/new" },
        ],
    },
    {
        title: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
    },
    {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
    {
        title: "Employees",
        href: "/admin/employees",
        icon: UserCog,
        children: [
            { title: "All Employees", href: "/admin/employees" },
            { title: "Add Employee", href: "/admin/employees/new" },
        ],
    },
    {
        title: "Inquiries",
        href: "/admin/inquiries",
        icon: MessageSquare,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="pb-0">
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-saffron)]">
                        <span className="text-xs font-bold text-white">SK</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">StartupKaro</p>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                </div>
                <Separator />
            </SidebarHeader>

            <SidebarContent className="pt-2">
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarMenu>
                        {navItems.map((item) => {
                            if (item.children) {
                                return (
                                    <Collapsible
                                        key={item.href}
                                        defaultOpen={isActive(item.href)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger>
                                                <SidebarMenuButton
                                                    isActive={isActive(item.href)}
                                                    tooltip={item.title}
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.children.map((child) => (
                                                        <SidebarMenuSubItem key={child.href}>
                                                            <SidebarMenuSubButton

                                                                isActive={pathname === child.href}
                                                            >
                                                                <Link href={child.href}>{child.title}</Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                );
                            }

                            return (
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
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <Separator />
                <div className="flex items-center gap-3 px-2 py-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[var(--color-saffron)] text-white text-xs">
                            AD
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Admin</p>
                        <p className="text-xs text-muted-foreground truncate">admin@startupkaro.com</p>
                    </div>
                    <Link href="/admin/login">
                        <LogOut className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}