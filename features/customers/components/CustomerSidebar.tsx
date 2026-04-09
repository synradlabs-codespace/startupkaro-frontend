"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Store,
    User,
    LogOut, 
    ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
    { title: "Dashboard", href: "/customer", icon: LayoutDashboard, exact: true },
    { title: "My Purchases", href: "/customer/purchases", icon: ShoppingBag },
    { title: "Services", href: "/customer/services", icon: Store },
    { title: "Profile", href: "/customer/profile", icon: User },
];

const ACCENT = "#FF9933";
const ACCENT_BG = "rgba(255, 153, 51, 0.10)";
const ACCENT_TEXT = "#d4720a";

export function CustomerSidebar() {
    const pathname = usePathname();
    const { state, setOpen } = useSidebar();
    const collapsed = state === "collapsed";

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

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
            <div className={`h-16 flex items-center px-4 py-5 border-b border-gray-50 ${collapsed ? "justify-center" : "justify-between"}`}>
                <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "w-auto" : "w-full"}`}>
                    {collapsed ? (
                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs text-white shadow-sm"
                            style={{ backgroundColor: ACCENT }}
                        >
                            SK
                        </div>
                    ) : (
                        <div className="flex flex-col whitespace-nowrap gap-0.5">
                            <img
                                src="/startupkaro-logo.svg"
                                alt="StartupKaro"
                                className="h-7 w-auto object-contain"
                            />
                            <p className="text-[11px] text-gray-400 leading-none pl-0.5">Customer Portal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 scrollbar-hide">
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    const hasChildren = !!(item as any).children;

                    return (
                        <div key={item.href} className="flex flex-col group relative">
                            <Link
                                href={item.href}
                                title={collapsed ? item.title : undefined}
                                className={`h-9 w-full rounded-lg flex items-center gap-2.5 px-3 transition-all duration-150 outline-none ${collapsed ? "justify-center" : ""}`}
                                style={active ? { backgroundColor: ACCENT_BG, color: ACCENT_TEXT } : { color: "#374151" }}
                            >
                                <item.icon className="h-[18px] w-[18px] shrink-0" />
                                {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-100 bg-white">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="text-white text-[11px] font-semibold" style={{ backgroundColor: ACCENT }}>RS</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-gray-900 truncate leading-none">Rahul Sharma</p>
                                <p className="text-[11px] text-gray-400 truncate mt-0.5">rahul@example.com</p>
                            </div>
                            <Link href="/customer/login" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50" title="Sign out">
                                <LogOut className="h-[15px] w-[15px]" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}