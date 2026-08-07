"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCustomerCart } from "@/features/customers/hooks/useCustomerCart";
import { formatINR } from "@/lib/currency";
import { CenterUnderline } from "@/components/custom/CenterUnderline";

const CART_ROUTE = "/customer/cart";

// Mimics the macOS Dock genie effect: the bar appears to get pulled up out of
// a point at the bottom edge (squished thin, then unfurling), and collapses
// back down into that same point in reverse when it disappears.
const genieVariants = {
    initial: { scaleX: 0.18, scaleY: 0.05, y: 26, opacity: 0 },
    animate: {
        scaleX: [0.18, 1.12, 0.97, 1],
        scaleY: [0.05, 0.7, 1.04, 1],
        y: [26, 4, -2, 0],
        opacity: [0, 1, 1, 1],
        transition: { duration: 0.55, times: [0, 0.55, 0.8, 1], ease: "easeOut" as const },
    },
    exit: {
        scaleX: [1, 0.85, 0.15],
        scaleY: [1, 0.4, 0.05],
        y: [0, 8, 26],
        opacity: [1, 1, 0],
        transition: { duration: 0.4, times: [0, 0.5, 1], ease: "easeIn" as const },
    },
};

export function CustomerCartDock() {
    const pathname = usePathname();
    const cartQuery = useCustomerCart();

    const itemCount = cartQuery.data?.summary.itemCount ?? 0;
    const total = cartQuery.data?.summary.total ?? 0;
    const isCartRoute = pathname === CART_ROUTE;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-50 flex justify-center px-4">
            <AnimatePresence>
                {itemCount > 0 && !isCartRoute && (
                    <motion.div
                        key="cart-dock"
                        variants={genieVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ transformOrigin: "bottom center" }}
                        className="pointer-events-auto w-fit max-w-[calc(100vw-2rem)] overflow-hidden rounded-full border border-white/60 bg-white/75 shadow-[0_8px_32px_rgba(41,110,249,0.2)] backdrop-blur-xl"
                    >
                        <Link
                            href={CART_ROUTE}
                            className="group flex items-stretch divide-x divide-hairline transition-transform duration-200 hover:-translate-y-0.5"
                        >
                            <span className="flex items-center gap-3 py-2.5 pl-3 pr-4">
                                <motion.span
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
                                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-brand/10"
                                >
                                    <ShoppingCart className="h-4 w-4 text-primary-brand" />
                                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-primary-brand px-1 text-[10px] font-bold text-white">
                                        {itemCount}
                                    </span>
                                </motion.span>
                                <span className="min-w-0">
                                    <span className="block text-[11px] font-semibold uppercase leading-none tracking-[0.28px] text-graphite">
                                        {itemCount} {itemCount === 1 ? "item" : "items"}
                                    </span>
                                    <span className="mt-1 block font-display text-sm font-medium leading-none text-ink">
                                        {formatINR(total)}
                                    </span>
                                </span>
                            </span>
                            <span className="flex items-center gap-0.5 py-2.5 pl-4 pr-4 text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand transition-colors duration-200 group-hover:text-primary-deep">
                                <CenterUnderline underlineHeightRatio={0.16}>View Cart</CenterUnderline>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
