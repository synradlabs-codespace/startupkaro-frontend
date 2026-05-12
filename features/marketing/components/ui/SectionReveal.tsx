"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealDirection = "left" | "up";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type SectionRevealProps = {
    children: ReactNode;
    direction?: RevealDirection;
    delay?: number;
    duration?: number;
    amount?: number;
};

export function SectionReveal({
    children,
    direction = "up",
    delay = 0,
    duration,
    amount = 0.22,
}: SectionRevealProps) {
    const prefersReducedMotion = useReducedMotion();
    const resolvedDuration = duration ?? (direction === "left" ? 0.65 : 0.55);
    const offset = direction === "left" ? { x: -28, y: 0 } : { x: 0, y: 28 };

    if (prefersReducedMotion) {
        return <div>{children}</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...offset }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount }}
            transition={{ duration: resolvedDuration, delay, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}
