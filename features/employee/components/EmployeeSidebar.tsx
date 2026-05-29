"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  MessageSquare,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { useEmployeeMe, useEmployeeLogout } from "@/features/auth/employee/hooks/useEmployeeAuth";
import { getInitials } from "@/features/admin/lib/format";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  children?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/employee", icon: LayoutDashboard, exact: true },
  { title: "Orders", href: "/employee/orders", icon: ShoppingCart },
  { title: "Customers", href: "/employee/customers", icon: Users },
  { title: "Inquiries", href: "/employee/inquiries", icon: MessageSquare },
  { title: "Profile", href: "/employee/profile", icon: User },
];

const ACCENT_BG_CLASS = "bg-primary-brand";
const ACCENT_TEXT_CLASS = "text-white";

export function EmployeeSidebar() {
  const pathname = usePathname();
  const { state, setOpen, isMobile, openMobile, setOpenMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";
  const me = useEmployeeMe();
  const logout = useEmployeeLogout();

  const closeMobile = () => { if (isMobile) setOpenMobile(false); };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    if (collapsed) setOpen(true);
  };

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
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-semibold text-xs text-white ${ACCENT_BG_CLASS}`}>
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
                <p className="text-[11px] text-steel leading-none pl-0.5">Employee Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
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
                    title={collapsed ? item.title : undefined}
                    className={`h-9 w-full rounded-md flex items-center gap-2.5 px-3 transition-all duration-150 cursor-pointer outline-none ${active ? `${ACCENT_BG_CLASS} ${ACCENT_TEXT_CLASS}` : "text-steel hover:bg-surface hover:text-ink"} ${collapsed ? "justify-center" : "justify-between"}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                    </div>
                    {!collapsed && <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-stone transition-transform ${isOpen ? "rotate-90" : ""}`} />}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    onClick={closeMobile}
                    className={`h-9 w-full rounded-md flex items-center gap-2.5 px-3 transition-all duration-150 outline-none ${active ? `${ACCENT_BG_CLASS} ${ACCENT_TEXT_CLASS}` : "text-steel hover:bg-surface hover:text-ink"} ${collapsed ? "justify-center" : ""}`}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-hairline">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={`text-white text-[11px] font-semibold ${ACCENT_BG_CLASS}`}>
                {me.name ? getInitials(me.name) : "EM"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink truncate leading-none">{me.name || "Employee"}</p>
                  <p className="text-[11px] text-steel truncate mt-0.5">{me.email || "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { logout(); closeMobile(); }}
                  className="p-1.5 rounded-md text-stone hover:text-error-brand hover:bg-error-brand/10"
                  title="Sign out"
                >
                  <LogOut className="h-[15px] w-[15px]" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
