"use client";

import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type BasicNumberTickerProps = {
    value: number;
    decimals?: number;
    className?: string;
    duration?: number;
};

export function BasicNumberTicker({
    value,
    decimals = 0,
    className,
    duration = 1.1,
}: BasicNumberTickerProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.8 });
    const prefersReducedMotion = useReducedMotion();
    const motionValue = useMotionValue(prefersReducedMotion ? value : 0);
    const [displayValue, setDisplayValue] = useState((prefersReducedMotion ? value : 0).toFixed(decimals));

    useMotionValueEvent(motionValue, "change", (latest) => {
        setDisplayValue(latest.toFixed(decimals));
    });

    useEffect(() => {
        if (!isInView || prefersReducedMotion) {
            motionValue.set(value);
            return;
        }

        const controls = animate(motionValue, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
        });

        return () => controls.stop();
    }, [duration, isInView, motionValue, prefersReducedMotion, value]);

    return <span ref={ref} className={cn("tabular-nums", className)}>{displayValue}</span>;
}
