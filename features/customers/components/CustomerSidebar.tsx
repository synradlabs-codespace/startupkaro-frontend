"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Store,
    User,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useCustomerCart } from "@/features/customers/hooks/useCustomerCart";
import { WHATSAPP_URL } from "@/components/custom/WhatsAppButton";
import { STARTUPKARO_LOGO_SRC } from "@/lib/brand";

const navItems = [
    { title: "Dashboard", href: "/customer", icon: LayoutDashboard, exact: true },
    { title: "My Purchases", href: "/customer/purchases", icon: ShoppingBag },
    { title: "Services", href: "/customer/services", icon: Store },
    { title: "Cart", href: "/customer/cart", icon: ShoppingCart },
    { title: "Profile", href: "/customer/profile", icon: User },
];

const ACCENT_BG_CLASS = "bg-primary-brand";
const ACCENT_TEXT_CLASS = "text-white";

export function CustomerSidebar() {
    const pathname = usePathname();
    const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
    const collapsed = !isMobile && state === "collapsed";
    const cartQuery = useCustomerCart();
    const cartItemCount = cartQuery.data?.summary.itemCount ?? 0;

    const closeMobile = () => { if (isMobile) setOpenMobile(false); };

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    const asideClass = isMobile
        ? `fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-hairline bg-canvas transition-transform duration-300 ease-in-out h-screen ${openMobile ? "translate-x-0" : "-translate-x-full"}`
        : `flex flex-col border-r border-hairline bg-canvas transition-all duration-300 ease-in-out relative z-20 h-screen ${collapsed ? "w-[80px]" : "w-64"}`;

    return (
        <>
            {isMobile && openMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setOpenMobile(false)}
                />
            )}
            <aside className={asideClass}>
                {/* Header */}
                <div className={`h-16 flex items-center px-4 py-5 border-b border-hairline ${collapsed ? "justify-center" : "justify-between"}`}>
                    <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? "w-auto" : "w-full"}`}>
                        {collapsed ? (
                            <Link href="/" className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-hairline">
                                <Image
                                    src="/assets/startupkaro-small-logo.jpeg"
                                    alt="StartupKaro"
                                    fill
                                    className="object-cover"
                                />
                            </Link>
                        ) : (
                            <Link href="/" className="flex whitespace-nowrap">
                                <Image
                                    src={STARTUPKARO_LOGO_SRC}
                                    alt="StartupKaro"
                                    width={188}
                                    height={35}
                                    className="h-[35px] w-auto object-contain"
                                    style={{ width: "auto" }}
                                />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 scrollbar-hide">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact);
                        const badgeCount = item.href === "/customer/cart" ? cartItemCount : 0;
                        return (
                            <div key={item.href} className="flex flex-col group relative">
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.title : undefined}
                                    onClick={closeMobile}
                                    className={`relative h-9 w-full rounded-md flex items-center gap-2.5 px-3 transition-all duration-150 outline-none ${active ? `${ACCENT_BG_CLASS} ${ACCENT_TEXT_CLASS}` : "text-black hover:bg-surface hover:text-black"} ${collapsed ? "justify-center" : ""}`}
                                >
                                    <span className="relative shrink-0">
                                        <item.icon className="h-[18px] w-[18px]" />
                                        {badgeCount > 0 && collapsed && (
                                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-error-brand" />
                                        )}
                                    </span>
                                    {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                                    {badgeCount > 0 && !collapsed && (
                                        <span className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${active ? "bg-white/20 text-white" : "bg-error-brand text-white"}`}>
                                            {badgeCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {!collapsed && (
                    <div className="px-5 pb-4">
                        <div className="rounded-xl bg-tint-sky/45 px-3.5 py-3.5">
                            <div className="mb-3 flex items-center gap-2.5">
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-canvas">
                                    <Image
                                        src="/assets/support-headset-icon.jpeg"
                                        alt=""
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[17px] font-semibold leading-tight text-black">Need Help?</p>
                                    <p className="mt-0.5 text-[13px] leading-snug text-black">Talk to our experts</p>
                                </div>
                            </div>
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={closeMobile}
                                className="flex h-10 w-full items-center justify-center rounded-md bg-primary-brand px-3 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(41,110,249,0.22)] transition-colors hover:bg-primary-brand/90"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                )}

            </aside>
        </>
    );
}
