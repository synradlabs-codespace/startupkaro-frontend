"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AUTH_SESSION_EVENT, clearAuthSession, getPanelRedirect, readAuthSession } from "@/lib/auth-session";
import type { Role } from "@/lib/rbac/roles";
import { ROLE_LOGIN_ROUTES } from "@/lib/rbac/roles";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShoppingCart,
  Store,
  User,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full",
        "bg-canvas/90 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/80",
        "border-b border-hairline",
        className
      )}
    >
      <div className="flex h-16 items-center px-6 md:px-6 max-w-[1400px] mx-0 gap-4">
        {/* Left Section: Navigation Controls */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="h-9 w-9 rounded-md border border-hairline bg-canvas hover:bg-surface hover:text-ink transition-all duration-200" />
          <Separator orientation="vertical" className="h-6 w-[1px] bg-hairline" />
        </div>

        {/* Center Section: Titles */}
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          <h1 className="text-sm font-medium text-ink truncate tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-[11px] leading-tight text-steel font-normal mt-1 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-500">
          {action}
          <PanelAccountDropdown />
        </div>
      </div>
    </header>
  );
}

type AccountLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

function getAccountLinks(role: Role): AccountLink[] {
  const dashboard = { label: "Dashboard", href: getPanelRedirect(role), icon: LayoutDashboard };

  if (role === "customer") {
    return [
      { label: "Home", href: "/", icon: Home },
      dashboard,
      { label: "Services", href: "/customer/services", icon: Store },
      { label: "Cart", href: "/customer/cart", icon: ShoppingCart },
      { label: "My Purchases", href: "/customer/purchases", icon: Package },
      { label: "Profile", href: "/customer/profile", icon: User },
    ];
  }

  if (role === "employee") {
    return [
      dashboard,
      { label: "Orders", href: "/employee/orders", icon: ShoppingCart },
      { label: "Customers", href: "/employee/customers", icon: Users },
      { label: "Inquiries", href: "/employee/inquiries", icon: MessageSquare },
      { label: "Profile", href: "/employee/profile", icon: User },
    ];
  }

  return [
    dashboard,
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Employees", href: "/admin/employees", icon: UserCog },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];
}

function PanelAccountDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(() => readAuthSession());
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 60);
  }, [clearCloseTimer]);

  useEffect(() => {
    const syncSession = () => setSession(readAuthSession());
    window.addEventListener("storage", syncSession);
    window.addEventListener(AUTH_SESSION_EVENT, syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(AUTH_SESSION_EVENT, syncSession);
    };
  }, []);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  if (!session.role) return null;

  const name = session.role === "admin" ? "Admin" : session.user?.name || "Account";
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const links = getAccountLinks(session.role);

  const handleLogout = () => {
    const loginRoute = ROLE_LOGIN_ROUTES[session.role!];
    clearAuthSession();
    router.replace(loginRoute);
  };

  return (
    <div onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors",
            open
              ? "border-primary-brand bg-surface text-primary-brand"
              : "border-hairline bg-canvas text-ink hover:border-primary-brand hover:bg-surface hover:text-primary-brand"
          )}
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-primary-brand font-display font-medium text-white">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate sm:inline">{name}</span>
          <ChevronDown className="size-3.5 text-graphite" strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="min-w-56 space-y-1 p-2"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          {links.map(({ label, href, icon: Icon }) => {
            const isDashboard = href === getPanelRedirect(session.role);
            const selected = isDashboard ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <DropdownMenuItem
                key={label}
                render={<Link href={href} aria-current={selected ? "page" : undefined} />}
                className={cn(
                  "cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm",
                  selected && "bg-primary-brand/10 font-semibold text-primary-brand focus:bg-primary-brand/10 focus:text-primary-brand"
                )}
              >
                <Icon className={cn("size-4", selected ? "text-primary-brand" : "text-graphite")} strokeWidth={2} />
                {label}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogout}
            className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
          >
            <LogOut className="size-4" strokeWidth={2} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
