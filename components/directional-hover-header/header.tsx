"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronLeft, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS, type NavLink, type NavMenu } from "./header/nav-data";
import { MegaMenu } from "./header/mega-menu";
import { cn } from "@/lib/utils";
import { FlowButton, FlowSecondaryButton } from "@/components/custom/FlowButton";

type Direction = "ltr" | "rtl";
const SHELL_EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const EXIT_EASE = [0.7, 0, 0.84, 0] as [number, number, number, number];
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function hasNavigableHref(href?: string): href is string {
  return Boolean(href && href !== "#");
}

function Logo() {
  return (
    <Link href="/" className="flex items-center select-none shrink-0" aria-label="StartupKaro">
      <Image
        src="/startupkaro-logo.svg"
        alt="StartupKaro"
        width={140}
        height={26}
        className="h-7 w-auto"
        priority
      />
    </Link>
  );
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <motion.span
    className="inline-flex text-current"
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.2, ease: SHELL_EASE }}
    aria-hidden
  >
    <ChevronDown className="size-3.5" strokeWidth={1.6} />
  </motion.span>
);

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.34, ease: SHELL_EASE } },
};

const panelVariants = {
  enter: { opacity: 0, x: 26 },
  center: { opacity: 1, x: 0, transition: { duration: 0.34, ease: SHELL_EASE } },
  exit: { opacity: 0, x: -18, transition: { duration: 0.24, ease: EXIT_EASE } },
};

function HeaderActions({ mobile = false, onAction }: { mobile?: boolean; onAction?: () => void }) {
  return (
    <div className={cn("flex items-center gap-3", mobile && "grid w-full grid-cols-2 gap-4")}>
      <FlowSecondaryButton
        href="/login"
        onClick={onAction}
        text="Login"
        iconName="log-in"
      />
      <FlowButton
        href="/services"
        onClick={onAction}
        text="Explore Services"
        iconName="briefcase"
        colorVariant="primary"
      />
    </div>
  );
}

export function Header() {
  const [activeMenu, setActiveMenu] = useState<NavMenu | null>(null);
  const [direction, setDirection] = useState<Direction>("ltr");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState<NavMenu | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const desktopItemRefs = useRef<Array<HTMLElement | null>>([]);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileBackButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef<number>(-1);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((menu: NavMenu, index: number) => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    if (activeIndexRef.current !== -1 && index !== activeIndexRef.current) {
      setDirection(index > activeIndexRef.current ? "rtl" : "ltr");
    }
    activeIndexRef.current = index;
    setActiveMenu(menu);
  }, []);

  const closeDesktopMenu = useCallback(() => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    setActiveMenu(null);
    activeIndexRef.current = -1;
  }, []);

  const scheduleClose = useCallback(() => {
    leaveTimerRef.current = setTimeout(() => closeDesktopMenu(), 120);
  }, [closeDesktopMenu]);

  const cancelClose = useCallback(() => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setMobileMenu(null);
  }, []);

  const focusFirstDesktopMenuItem = useCallback(() => {
    const firstItem = megaMenuRef.current?.querySelector<HTMLElement>('[data-mega-menu-item="true"]');
    firstItem?.focus();
  }, []);

  const focusDesktopItem = useCallback((index: number) => {
    desktopItemRefs.current[index]?.focus();
  }, []);

  const moveDesktopFocus = useCallback(
    (currentIndex: number, step: 1 | -1) => {
      const total = NAV_LINKS.length;
      let nextIndex = currentIndex;
      for (let count = 0; count < total; count++) {
        nextIndex = (nextIndex + step + total) % total;
        const nextItem = desktopItemRefs.current[nextIndex];
        if (!nextItem) continue;
        nextItem.focus();
        const nextLink = NAV_LINKS[nextIndex];
        if (nextLink.menu) { cancelClose(); openMenu(nextLink.menu, nextIndex); }
        else { closeDesktopMenu(); }
        break;
      }
    },
    [cancelClose, closeDesktopMenu, openMenu],
  );

  const handleDesktopItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, link: NavLink, index: number) => {
      if (event.key === "ArrowRight") { event.preventDefault(); moveDesktopFocus(index, 1); return; }
      if (event.key === "ArrowLeft") { event.preventDefault(); moveDesktopFocus(index, -1); return; }
      if (event.key === "Escape") { event.preventDefault(); closeDesktopMenu(); focusDesktopItem(index); return; }
      if (!link.menu) return;
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        cancelClose();
        openMenu(link.menu, index);
        requestAnimationFrame(() => focusFirstDesktopMenuItem());
        return;
      }
      if (event.key === "Tab" && !event.shiftKey && activeMenu?.id === link.menu.id) {
        event.preventDefault();
        focusFirstDesktopMenuItem();
      }
    },
    [activeMenu, cancelClose, closeDesktopMenu, focusDesktopItem, focusFirstDesktopMenuItem, moveDesktopFocus, openMenu],
  );

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    return () => { if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current); };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { closeMobileMenu(); return; }
      if (event.key !== "Tab") return;
      const container = shellRef.current;
      if (!container) return;
      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => {
        if (el.getAttribute("aria-hidden") === "true") return false;
        if ("disabled" in el && el.disabled) return false;
        return el.offsetParent !== null;
      });
      if (focusableElements.length === 0) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusedElementRef.current?.focus();
      previousFocusedElementRef.current = null;
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const frame = requestAnimationFrame(() => {
      const focusTarget = mobileMenu ? mobileBackButtonRef.current : mobileToggleRef.current;
      focusTarget?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isMobileMenuOpen, mobileMenu]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) { setMobileMenu(null); setIsMobileMenuOpen(false); }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const openMobileMenu = useCallback(() => {
    cancelClose();
    closeDesktopMenu();
    setMobileMenu(null);
    setIsMobileMenuOpen(true);
  }, [cancelClose, closeDesktopMenu]);

  const isDesktopMenuVisible = !!activeMenu && !isMobileMenuOpen;

  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-5">
      <div
        ref={shellRef}
        className={cn(
          "relative mx-auto w-full max-w-7xl bg-canvas shadow-sm transition-[height,border-radius] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          {
            "h-16 rounded-xl border border-hairline": !isDesktopMenuVisible && !isMobileMenuOpen,
            "overflow-visible rounded-t-xl border-x border-t border-hairline": isDesktopMenuVisible,
            "h-[calc(100dvh-2.5rem)] overflow-hidden rounded-xl border border-hairline": isMobileMenuOpen,
            "overflow-hidden": !isDesktopMenuVisible && !isMobileMenuOpen,
          },
        )}
      >
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5">
          <div className="flex min-w-0 items-center">
            {isMobileMenuOpen && mobileMenu ? (
              <button
                ref={mobileBackButtonRef}
                type="button"
                onClick={() => setMobileMenu(null)}
                className="inline-flex items-center gap-2 text-base font-medium text-ink"
              >
                <ChevronLeft className="size-4.5" strokeWidth={2} />
                Back
              </button>
            ) : (
              <Logo />
            )}
          </div>

          <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link, linkIndex) => {
              const hasMenu = !!link.menu;
              const isOpen = hasMenu && activeMenu?.id === link.menu!.id;
              const itemClassName = cn(
                "flex select-none items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors duration-150",
                isOpen ? "text-link-blue bg-primary-soft/50" : "text-slate hover:text-link-blue hover:bg-primary-soft/30",
              );

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasMenu) { cancelClose(); openMenu(link.menu!, linkIndex); }
                    else scheduleClose();
                  }}
                  onMouseLeave={scheduleClose}
                >
                  {hasMenu ? (
                    <button
                      ref={(node) => { desktopItemRefs.current[linkIndex] = node; }}
                      type="button"
                      onFocus={() => { cancelClose(); openMenu(link.menu!, linkIndex); }}
                      onKeyDown={(event) => handleDesktopItemKeyDown(event, link, linkIndex)}
                      className={itemClassName}
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      aria-controls="desktop-mega-menu"
                    >
                      {link.label}
                      <ChevronIcon open={isOpen} />
                    </button>
                  ) : hasNavigableHref(link.href) ? (
                    <Link
                      ref={(node) => { desktopItemRefs.current[linkIndex] = node; }}
                      href={link.href}
                      onFocus={closeDesktopMenu}
                      onKeyDown={(event) => handleDesktopItemKeyDown(event, link, linkIndex)}
                      className={itemClassName}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      ref={(node) => { desktopItemRefs.current[linkIndex] = node; }}
                      type="button"
                      onFocus={closeDesktopMenu}
                      onKeyDown={(event) => handleDesktopItemKeyDown(event, link, linkIndex)}
                      className={itemClassName}
                    >
                      {link.label}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto hidden shrink-0 lg:flex">
            <HeaderActions />
          </div>

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
            className="ml-auto inline-flex size-10 items-center justify-center rounded-md border border-hairline bg-surface text-charcoal transition-colors duration-150 hover:bg-surface-soft lg:hidden"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={1.9} />}
          </button>
        </div>

        <MegaMenu
          menu={isMobileMenuOpen ? null : activeMenu}
          direction={direction}
          panelRef={megaMenuRef}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onEscape={() => {
            const activeIndex = activeIndexRef.current;
            closeDesktopMenu();
            if (activeIndex >= 0) focusDesktopItem(activeIndex);
          }}
        />

        <AnimatePresence initial={false} mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              key="mobile-navigation"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.24, ease: SHELL_EASE }}
              className="absolute inset-x-0 top-16 bottom-0 bg-canvas lg:hidden"
            >
              <div className="relative flex h-full flex-col">
                <div className="flex-1 overflow-y-auto sm:px-6 sm:pt-8">
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileMenu ? (
                      <motion.div
                        key={mobileMenu.id}
                        variants={panelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-0"
                      >
                        {mobileMenu.columns.map((column, index) => (
                          <motion.section
                            key={column.heading}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={cn(
                              "px-4 py-8",
                              index !== 0 && "border-t border-hairline",
                              column.accent ? "bg-primary-soft/40" : "bg-canvas",
                            )}
                          >
                            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-stone">
                              {column.heading}
                            </p>
                            <motion.div
                              variants={listVariants}
                              initial="hidden"
                              animate="visible"
                              className="space-y-6"
                            >
                              {column.items.map((item) => (
                                <motion.a
                                  key={item.label}
                                  variants={itemVariants}
                                  href={item.href ?? "#"}
                                  onClick={closeMobileMenu}
                                  className="block"
                                >
                                  <span className="block text-base font-semibold leading-none text-ink">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="mt-1.5 block text-sm leading-snug text-slate">
                                      {item.description}
                                    </span>
                                  )}
                                </motion.a>
                              ))}
                            </motion.div>
                          </motion.section>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="root-mobile-menu"
                        variants={panelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        <motion.div
                          variants={listVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-0"
                        >
                          {NAV_LINKS.map((link) => {
                            const hasMenu = !!link.menu;
                            return (
                              <motion.div
                                key={link.label}
                                variants={itemVariants}
                                className="border-b border-hairline"
                              >
                                {hasMenu ? (
                                  <button
                                    type="button"
                                    onClick={() => setMobileMenu(link.menu!)}
                                    className="group flex w-full items-center justify-between gap-4 px-3 py-6 text-left transition-colors duration-150 hover:bg-primary-soft/40"
                                  >
                                    <span className="text-base font-semibold text-ink transition-colors duration-150 group-hover:text-link-blue">{link.label}</span>
                                    <ArrowRight className="size-4 text-stone transition-colors duration-150 group-hover:text-link-blue" strokeWidth={2} />
                                  </button>
                                ) : hasNavigableHref(link.href) ? (
                                  <a
                                    href={link.href}
                                    onClick={closeMobileMenu}
                                    className="group flex items-center justify-between gap-4 px-3 py-6 transition-colors duration-150 hover:bg-primary-soft/40"
                                  >
                                    <span className="text-base font-semibold text-ink transition-colors duration-150 group-hover:text-link-blue">{link.label}</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    className="group flex w-full items-center justify-between gap-4 px-3 py-6 text-left transition-colors duration-150 hover:bg-primary-soft/40"
                                  >
                                    <span className="text-base font-semibold text-ink transition-colors duration-150 group-hover:text-link-blue">{link.label}</span>
                                  </button>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="shrink-0 border-t border-hairline bg-canvas/95 px-4 pb-6 pt-4 backdrop-blur-sm sm:px-6">
                  <HeaderActions mobile onAction={closeMobileMenu} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;
