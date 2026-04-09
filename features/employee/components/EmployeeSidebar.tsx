"use client";

import { useState } from "react";
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

const navItems = [
  { title: "Dashboard", href: "/employee", icon: LayoutDashboard, exact: true },
  { title: "Orders", href: "/employee/orders", icon: ShoppingCart },
  { title: "Customers", href: "/employee/customers", icon: Users },
  { title: "Inquiries", href: "/employee/inquiries", icon: MessageSquare },
  { title: "Profile", href: "/employee/profile", icon: User },
];

const ACCENT = "#000080"; // Navy Blue
const ACCENT_BG = "rgba(0, 0, 128, 0.05)";
const ACCENT_TEXT = "#000080";

export function EmployeeSidebar() {
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
              <p className="text-[11px] text-gray-400 leading-none pl-0.5">Employee Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const hasChildren = !!(item as any).children;
          const isOpen = openMenus[item.title];

          return (
            <div key={item.href} className="flex flex-col group relative">
              {hasChildren ? (
                <button
                  onClick={() => toggleMenu(item.title)}
                  title={collapsed ? item.title : undefined}
                  className={`h-9 w-full rounded-lg flex items-center gap-2.5 px-3 transition-all duration-150 cursor-pointer outline-none ${collapsed ? "justify-center" : "justify-between"
                    }`}
                  style={active && !collapsed ? { backgroundColor: ACCENT_BG, color: ACCENT_TEXT } : { color: "#374151" }}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-[18px] w-[18px] shrink-0" style={active ? { color: ACCENT_TEXT } : {}} />
                    {!collapsed && <span className="text-[13px] font-medium whitespace-nowrap">{item.title}</span>}
                  </div>
                  {!collapsed && <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />}
                </button>
              ) : (
                <Link
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  className={`h-9 w-full rounded-lg flex items-center gap-2.5 px-3 transition-all duration-150 outline-none ${collapsed ? "justify-center" : ""}`}
                  style={active ? { backgroundColor: ACCENT_BG, color: ACCENT_TEXT } : { color: "#374151" }}
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
      <div className="px-3 py-4 border-t border-gray-100 bg-white">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-white text-[11px] font-semibold" style={{ backgroundColor: ACCENT }}>EM</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900 truncate leading-none">Employee</p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">employee@startupkaro.com</p>
              </div>
              <Link href="/employee/login" className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50" title="Sign out">
                <LogOut className="h-[15px] w-[15px]" />
              </Link>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}