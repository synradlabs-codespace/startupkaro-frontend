"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Store,
    User,
    LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";

const navItems = [
    { title: "Dashboard", href: "/customer", icon: LayoutDashboard, exact: true },
    { title: "My Purchases", href: "/customer/purchases", icon: ShoppingBag },
    { title: "Services", href: "/customer/services", icon: Store },
    { title: "Profile", href: "/customer/profile", icon: User },
];

const ACCENT_BG_CLASS = "bg-primary-brand";
const ACCENT_TEXT_CLASS = "text-white";

export function CustomerSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside
            className={`flex flex-col border-r border-hairline bg-canvas transition-all duration-300 ease-in-out relative z-20 h-screen ${collapsed ? "w-[80px]" : "w-64"
                }`}
        >
            {/* Header */}
            <div className={`h-16 flex items-center px-4 py-5 border-b border-hairline ${collapsed ? "justify-center" : "justify-between"}`}>
                <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "w-auto" : "w-full"}`}>
                    {collapsed ? (
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-semibold text-xs text-charcoal ${ACCENT_BG_CLASS}`}
                        >
                            SK
                        </div>
                    ) : (
                        <div className="flex flex-col whitespace-nowrap gap-0.5">
                            <Image
                                src="/startupkaro-logo.svg"
                                alt="StartupKaro"
                                width={140}
                                height={26}
                                className="h-7 w-auto object-contain"
                            />
                            <p className="text-[11px] text-steel leading-none pl-0.5">Customer Portal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 scrollbar-hide">
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <div key={item.href} className="flex flex-col group relative">
                            <Link
                                href={item.href}
                                title={collapsed ? item.title : undefined}
                            className={`h-9 w-full rounded-md flex items-center gap-2.5 px-3 transition-all duration-150 outline-none ${active ? `${ACCENT_BG_CLASS} ${ACCENT_TEXT_CLASS}` : "text-steel hover:bg-surface hover:text-ink"} ${collapsed ? "justify-center" : ""}`}
                            >
                                <item.icon className="h-[18px] w-[18px] shrink-0" />
                                {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-hairline">
                <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={`text-charcoal text-[11px] font-semibold ${ACCENT_BG_CLASS}`}>RS</AvatarFallback>
                    </Avatar>
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-ink truncate leading-none">Rahul Sharma</p>
                                <p className="text-[11px] text-steel truncate mt-0.5">rahul@example.com</p>
                            </div>
                            <Link href="/customer/login" className="p-1.5 rounded-md text-stone hover:text-error-brand hover:bg-red-50" title="Sign out">
                                <LogOut className="h-[15px] w-[15px]" />
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
