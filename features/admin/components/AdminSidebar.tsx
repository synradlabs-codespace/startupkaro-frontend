"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        children: [
            { title: "All Orders", href: "/admin/orders" },
            { title: "New Order", href: "/admin/orders/new" },
        ],
    },
    { title: "Payments", href: "/admin/payments", icon: CreditCard },
    { title: "Customers", href: "/admin/customers", icon: Users },
    {
        title: "Employees",
        href: "/admin/employees",
        icon: UserCog,
        children: [
            { title: "All Employees", href: "/admin/employees" },
            { title: "Add Employee", href: "/admin/employees/new" },
        ],
    },
    { title: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const ACCENT = "#FF9933";
const ACCENT_BG = "rgba(255, 153, 51, 0.10)";
const ACCENT_TEXT = "#d4720a";

export function AdminSidebar() {
    const pathname = usePathname();

    
    const { state, setOpen } = useSidebar();
    const collapsed = state === "collapsed";

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {};
        navItems.forEach(item => {
            if (item.children) {
                initialState[item.title] = item.children.some(child => pathname.startsWith(child.href));
            }
        });
        return initialState;
    });

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
        
        if (collapsed) setOpen(true);
    };

    return (
        <aside
            className={`flex flex-col border-r border-gray-100 bg-white transition-all duration-300 ease-in-out relative z-20 h-screen ${collapsed ? "w-[80px]" : "w-64"
                }`}
        >
            {/* Header */}
            <div className={`h-16 flex items-center px-4 py-5 transition-all duration-200 border-b border-gray-50 ${collapsed ? "justify-center" : "justify-between"}`}>
                <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "w-auto" : "w-full"}`}>
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs text-white shadow-sm"
                        style={{ backgroundColor: ACCENT }}
                    >
                        SK
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col whitespace-nowrap fade-in">
                            <p className="text-[13px] font-semibold text-gray-900 leading-none tracking-tight">
                                StartupKaro
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1 leading-none">Admin Panel</p>
                        </div>
                    )}
                </div>
                {/* Notice: Local toggle buttons have been removed. The Header handles it now! */}
            </div>

            {/* Content / Nav Links */}
            {/* 3. Added overflow-x-hidden to strictly prevent horizontal scrolling */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 scrollbar-hide">
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    const hasChildren = !!item.children;
                    const isOpen = openMenus[item.title];

                    return (
                        <div key={item.href} className="flex flex-col group relative">
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleMenu(item.title)}
                                    // 4. Added native 'title' attribute for tooltips instead of CSS divs
                                    title={collapsed ? item.title : undefined}
                                    className={`h-9 w-full rounded-lg flex items-center gap-2.5 px-3 transition-all duration-150 cursor-pointer outline-none ${collapsed ? "justify-center" : "justify-between"
                                        }`}
                                    style={active && !collapsed ? { backgroundColor: ACCENT_BG, color: ACCENT_TEXT } : { color: "#374151" }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <item.icon className="h-[18px] w-[18px] shrink-0" style={active ? { color: ACCENT_TEXT } : {}} />
                                        {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                                    </div>
                                    {!collapsed && (
                                        <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
                                    )}
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.title : undefined}
                                    className={`h-9 w-full rounded-lg flex items-center gap-2.5 px-3 transition-all duration-150 outline-none ${collapsed ? "justify-center" : ""
                                        }`}
                                    style={active ? { backgroundColor: ACCENT_BG, color: ACCENT_TEXT } : { color: "#374151" }}
                                >
                                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                                    {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                                </Link>
                            )}

                            {/* Accordion Content */}
                            {hasChildren && isOpen && !collapsed && (
                                <div className="ml-[22px] mt-1 border-l border-gray-100 pl-3 space-y-1 py-1">
                                    {item.children?.map((child) => {
                                        const childActive = pathname === child.href;
                                        return (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={`h-8 rounded-md flex items-center text-[12.5px] font-medium w-full px-2 transition-all duration-150 ${childActive ? "bg-opacity-50" : "hover:bg-gray-50 hover:text-gray-900"
                                                    }`}
                                                style={
                                                    childActive
                                                        ? { color: ACCENT_TEXT, backgroundColor: ACCENT_BG }
                                                        : { color: "#6b7280" }
                                                }
                                            >
                                                {child.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-100 bg-white">
                {collapsed ? (
                    <div className="group relative flex justify-center cursor-pointer" title="Admin">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback
                                className="text-white text-[11px] font-semibold"
                                style={{ backgroundColor: ACCENT }}
                            >
                                AD
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback
                                className="text-white text-[11px] font-semibold"
                                style={{ backgroundColor: ACCENT }}
                            >
                                AD
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-gray-900 truncate leading-none">Admin</p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">admin@startupkaro.com</p>
                        </div>
                        <Link
                            href="/admin/login"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 block"
                            title="Sign out"
                        >
                            <LogOut className="h-[15px] w-[15px]" />
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
}