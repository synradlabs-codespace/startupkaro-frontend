"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, Menu, Package, ShoppingCart, User, X, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, type NavLink } from "./header/nav-data";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categoryCardStyles, serviceCategoryIcons, type ServiceVisualCategory } from "@/lib/category-pills";
import { cn } from "@/lib/utils";
import { AUTH_SESSION_EVENT, getPanelRedirect, readAuthSession } from "@/lib/auth-session";
import type { Role } from "@/lib/rbac/roles";
import { STARTUPKARO_LOGO_SRC } from "@/lib/brand";

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center select-none" aria-label="StartupKaro home">
      <Image
        src={STARTUPKARO_LOGO_SRC}
        alt="StartupKaro"
        width={204}
        height={37}
        className="h-[34px] w-auto sm:h-[37px]"
        style={{ width: "auto" }}
        priority
      />
    </Link>
  );
}

type AccountMenuLink = { label: string; href: string; icon: LucideIcon };

function getAccountMenuLinks(role: Role): AccountMenuLink[] {
  const dashboardLink: AccountMenuLink = { label: "Dashboard", href: getPanelRedirect(role), icon: LayoutDashboard };

  if (role === "customer") {
    return [
      dashboardLink,
      { label: "Cart", href: "/customer/cart", icon: ShoppingCart },
      { label: "My Purchases", href: "/customer/purchases", icon: Package },
      { label: "Profile", href: "/customer/profile", icon: User },
    ];
  }

  if (role === "employee") {
    return [dashboardLink, { label: "Profile", href: "/employee/profile", icon: User }];
  }

  return [dashboardLink];
}

function AccountMenu({
  role,
  name,
  mobile = false,
  onAction,
}: {
  role: Role;
  name: string;
  mobile?: boolean;
  onAction?: () => void;
}) {
  const links = getAccountMenuLinks(role);
  const initial = name.trim().charAt(0).toUpperCase() || "U";
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
  }, [clearCloseTimer, setOpen]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 60);
  }, [clearCloseTimer, setOpen]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  if (mobile) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "inline-flex h-11 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm font-semibold transition-colors",
            open
              ? "border-primary-brand bg-surface text-primary-brand"
              : "border-hairline bg-canvas text-ink hover:border-primary-brand hover:bg-surface hover:text-primary-brand"
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary-brand font-display font-medium text-white">
                {initial}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 truncate">{name}</span>
          </span>
          <ChevronDown className={cn("size-3.5 shrink-0 text-graphite transition-transform", open && "rotate-180")} strokeWidth={2} />
        </button>
        {open && (
          <div className="mt-2 space-y-1 rounded-lg border border-hairline bg-canvas p-2 shadow-[0_10px_30px_rgba(26,26,26,0.12)]">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={onAction}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-surface hover:text-primary-brand"
              >
                <Icon className="size-4 text-graphite" strokeWidth={2} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

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
          <span className="max-w-32 truncate">{name}</span>
          <ChevronDown className="size-3.5 text-graphite" strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="min-w-56 space-y-1 p-2"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleClose}
        >
          {links.map(({ label, href, icon: Icon }) => (
            <DropdownMenuItem
              key={label}
              render={<Link href={href} />}
              className="cursor-pointer gap-3 rounded-lg px-3 py-2.5 text-sm"
            >
              <Icon className="size-4 text-graphite" strokeWidth={2} />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function HeaderActions({ mobile = false, onAction }: { mobile?: boolean; onAction?: () => void }) {
  const [role, setRole] = useState<Role | null>(null);
  const [displayName, setDisplayName] = useState("Account");
  const [servicesHref, setServicesHref] = useState("/services");

  useEffect(() => {
    const syncLoginTarget = () => {
      const session = readAuthSession();
      if (session.accessToken && session.role) {
        setRole(session.role);
        setDisplayName(session.role === "admin" ? "Admin" : session.user?.name || "Account");
        setServicesHref(session.role === "customer" ? "/customer/services" : "/services");
      } else {
        setRole(null);
        setServicesHref("/services");
      }
    };

    syncLoginTarget();
    window.addEventListener("storage", syncLoginTarget);
    window.addEventListener(AUTH_SESSION_EVENT, syncLoginTarget);
    return () => {
      window.removeEventListener("storage", syncLoginTarget);
      window.removeEventListener(AUTH_SESSION_EVENT, syncLoginTarget);
    };
  }, []);

  if (role) {
    return (
      <div className={cn("flex items-center gap-3", mobile && "w-full flex-col")}>
        <FlowButton
          href={servicesHref}
          onClick={onAction}
          text="Explore Services"
          iconName="briefcase"
          colorVariant="primary"
          className={cn("h-11 px-6", mobile && "w-full")}
          wrapperClassName={mobile ? "w-full justify-stretch" : undefined}
        />
        <AccountMenu role={role} name={displayName} mobile={mobile} onAction={onAction} />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", mobile && "grid w-full grid-cols-1 sm:grid-cols-2")}>
      <FlowButton
        href={servicesHref}
        onClick={onAction}
        text="Explore Services"
        iconName="briefcase"
        colorVariant="primary"
        className={cn("h-11 px-6", mobile && "w-full")}
        wrapperClassName={mobile ? "w-full justify-stretch" : undefined}
      />
      <FlowSecondaryButton
        href="/customer/login"
        onClick={onAction}
        text="Login"
        iconName="log-in"
        showIcon={false}
        className={cn("h-11 px-6", mobile && "w-full")}
        wrapperClassName={mobile ? "w-full justify-stretch" : undefined}
      />
    </div>
  );
}

function isServiceCategory(heading: string): heading is ServiceVisualCategory {
  return heading === "Bundles" || heading === "Start" || heading === "Manage" || heading === "Protect" || heading === "Tech";
}

function DesktopColumnHeading({ heading, href, serviceMenu, onClose }: { heading: string; href?: string; serviceMenu: boolean; onClose?: () => void }) {
  if (!serviceMenu || !isServiceCategory(heading)) {
    const content = (
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-graphite">
        {heading}
      </p>
    );

    return href ? (
      <Link href={href} onClick={onClose} className="group inline-block">
        {content}
      </Link>
    ) : content;
  }

  const Icon = serviceCategoryIcons[heading];
  const styles = categoryCardStyles[heading];

  const content = (
    <>
      <span className={cn("flex size-9 items-center justify-center rounded-lg", styles.iconBg)}>
        <Icon className={cn("size-4.5", styles.iconText)} strokeWidth={2} />
      </span>
      <span className={cn(
        "rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
        styles.badge,
        href && "group-hover:border-primary-brand",
      )}>
        {heading}
      </span>
    </>
  );

  return href ? (
    <Link href={href} onClick={onClose} className="group mb-5 flex w-fit items-center gap-3">
      {content}
    </Link>
  ) : (
    <div className="mb-5 flex items-center gap-3">{content}</div>
  );
}

function DesktopMenuPanel({ link, onClose }: { link: NavLink; onClose?: () => void }) {
  if (!link.menu) return null;

  const serviceMenu = link.menu.id === "services";

  return (
    <div className="absolute inset-x-0 top-full border-y border-hairline bg-canvas shadow-[0_22px_54px_rgba(26,26,26,0.09)] before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-['']">
      <div
        className={cn("grid w-full divide-x divide-hairline", serviceMenu && "max-h-[calc(100vh-9rem)] overflow-y-auto")}
        style={{ gridTemplateColumns: `repeat(${link.menu.columns.length}, minmax(0, 1fr))` }}
      >
        {link.menu.columns.map((column) => (
          <div
            key={column.heading}
            className={cn(
              "px-8 py-8",
              serviceMenu ? "min-h-0 py-6" : "min-h-64",
              column.accent && !serviceMenu && "bg-tint-sky/35",
            )}
          >
            <DesktopColumnHeading heading={column.heading} href={column.href} serviceMenu={serviceMenu} onClose={onClose} />
            <div className={cn(serviceMenu ? "space-y-1.5" : "space-y-2")}>
              {column.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  onClick={onClose}
                  className={cn(
                    "group block rounded-md transition-colors hover:bg-surface",
                    serviceMenu ? "px-3 py-2.5" : "px-3 py-3",
                  )}
                >
                  <span className={cn(
                    "block font-semibold text-ink transition-colors group-hover:text-primary-brand",
                    serviceMenu ? "text-sm leading-5" : "text-sm",
                  )}>
                    {item.label}
                  </span>
                  {item.description && !serviceMenu && (
                    <span className="mt-1 block text-xs leading-5 text-slate">{item.description}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {serviceMenu && (
        <Link
          href="/services"
          onClick={onClose}
          className="group relative flex min-h-14 items-center justify-center border-t border-hairline/60 bg-canvas px-8 text-sm font-semibold text-ink transition-colors hover:bg-surface hover:text-primary-brand"
        >
          <span className="absolute -top-px left-0 h-px w-full origin-center scale-x-0 bg-primary-brand transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100" />
          <span>View All Services</span>
        </Link>
      )}
    </div>
  );
}

function MobileNavItem({
  link,
  expanded,
  onToggle,
  onNavigate,
}: {
  link: NavLink;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  if (!link.menu) {
    return (
      <Link
        href={link.href ?? "#"}
        onClick={onNavigate}
        className="flex min-h-16 items-center border-b border-hairline px-5 text-base font-semibold text-ink"
      >
        {link.label}
      </Link>
    );
  }

  const serviceMenu = link.menu.id === "services";

  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-16 w-full items-center justify-between gap-4 px-5 text-left"
        aria-expanded={expanded}
      >
        <span className={cn("text-base font-semibold", expanded ? "text-primary-brand" : "text-ink")}>
          {link.label}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-slate transition-transform", expanded && "rotate-180 text-primary-brand")}
          strokeWidth={2}
        />
      </button>

      {expanded && (
        <div className="bg-surface px-5 pb-5">
          {link.menu.columns.map((column) => (
            <div key={column.heading} className="pt-5">
              {serviceMenu && isServiceCategory(column.heading) ? (
                (() => {
                  const Icon = serviceCategoryIcons[column.heading];
                  const styles = categoryCardStyles[column.heading];
                  const content = (
                    <>
                      <span className={cn("flex size-8 items-center justify-center rounded-lg", styles.iconBg)}>
                        <Icon className={cn("size-4", styles.iconText)} strokeWidth={2} />
                      </span>
                      <span className={cn(
                        "rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                        styles.badge,
                      )}>
                        {column.heading}
                      </span>
                    </>
                  );

                  return column.href ? (
                    <Link href={column.href} onClick={onNavigate} className="mb-2 flex w-fit items-center gap-2">
                      {content}
                    </Link>
                  ) : (
                    <div className="mb-2 flex items-center gap-2">{content}</div>
                  );
                })()
              ) : column.href ? (
                <Link
                  href={column.href}
                  onClick={onNavigate}
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-graphite"
                >
                  {column.heading}
                </Link>
              ) : (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-graphite">
                  {column.heading}
                </p>
              )}
              <div className="space-y-1">
                {column.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href ?? "#"}
                    onClick={onNavigate}
                    className="block rounded-md py-2.5 text-sm font-medium text-charcoal"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLink = NAV_LINKS.find((link) => link.label === activeLabel && link.menu);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeDesktopMenu = useCallback(() => {
    clearCloseTimer();
    setActiveLabel(null);
  }, [clearCloseTimer]);

  const scheduleDesktopClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setActiveLabel(null), 320);
  }, [clearCloseTimer]);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
    setExpandedLabel(null);
  }, []);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isMobileOpen]);

  const handleMobileNavTouch = useCallback((event: React.TouchEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-18 max-w-full border-b border-hairline bg-canvas/95 shadow-sm backdrop-blur-xl"
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleDesktopClose}
      >
        <div className="grid h-full w-full max-w-full grid-cols-[minmax(0,auto)_1fr_auto] items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
          <Logo />

          <nav className="hidden h-full items-center justify-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isOpen = activeLabel === link.label;
              const itemClassName = cn(
                "inline-flex h-11 items-center gap-1.5 rounded-md px-4 text-sm font-semibold text-charcoal transition-colors",
                "hover:bg-surface hover:text-primary-brand",
                isOpen && "bg-surface text-primary-brand",
              );

              if (!link.menu) {
                return (
                  <Link
                    key={link.label}
                    href={link.href ?? "#"}
                    onMouseEnter={closeDesktopMenu}
                    className={itemClassName}
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <button
                  key={link.label}
                  type="button"
                  onMouseEnter={() => {
                    clearCloseTimer();
                    setActiveLabel(link.label);
                  }}
                  onFocus={() => {
                    clearCloseTimer();
                    setActiveLabel(link.label);
                  }}
                  className={itemClassName}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                >
                  {link.label}
                  <ChevronDown
                    className={cn("size-3.5 transition-transform", isOpen && "rotate-180")}
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center justify-end lg:flex">
            <HeaderActions />
          </div>

          <button
            type="button"
            onClick={() => {
              closeDesktopMenu();
              setIsMobileOpen(true);
            }}
            className="ml-auto inline-flex size-11 items-center justify-center rounded-md border border-hairline bg-surface text-charcoal transition-colors hover:bg-cloud lg:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
          >
            <Menu className="size-5" strokeWidth={2} />
          </button>
        </div>

        {activeLink && (
          <div onMouseEnter={clearCloseTimer} onMouseLeave={scheduleDesktopClose}>
            <DesktopMenuPanel link={activeLink} onClose={closeDesktopMenu} />
          </div>
        )}
      </header>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-canvas lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{ height: "100dvh" }}
        >
          <div
            className="flex h-18 shrink-0 items-center justify-between border-b border-hairline px-4 sm:px-6"
          >
            <Logo />
            <button
              type="button"
              onClick={closeMobile}
              className="inline-flex size-11 items-center justify-center rounded-md border border-hairline bg-surface text-charcoal"
              aria-label="Close navigation menu"
            >
              <X className="size-5" strokeWidth={2} />
            </button>
          </div>

          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            aria-label="Mobile navigation"
            onTouchStart={handleMobileNavTouch}
            onTouchMove={handleMobileNavTouch}
            style={{
              WebkitOverflowScrolling: "touch",
              overflowY: "scroll",
              touchAction: "pan-y",
            }}
          >
            {NAV_LINKS.map((link) => (
              <MobileNavItem
                key={link.label}
                link={link}
                expanded={expandedLabel === link.label}
                onToggle={() => setExpandedLabel((current) => (current === link.label ? null : link.label))}
                onNavigate={closeMobile}
              />
            ))}
          </nav>

          <div
            className="shrink-0 border-t border-hairline bg-canvas px-5 py-5"
          >
            <HeaderActions mobile onAction={closeMobile} />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
