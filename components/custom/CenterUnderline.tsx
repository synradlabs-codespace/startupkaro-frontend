"use client";

import { ElementType, useEffect, useRef, useState, useMemo } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

interface CenterUnderlineProps {
    children: React.ReactNode;
    as?: ElementType;
    className?: string;
    transition?: Transition;
    underlineHeightRatio?: number;
    underlinePaddingRatio?: number;
}

export function CenterUnderline({
    children,
    as,
    className,
    transition = { duration: 0.25, ease: "easeInOut" },
    underlineHeightRatio = 0.1,
    underlinePaddingRatio = 0.01,
    ...props
}: CenterUnderlineProps) {
    const [hovered, setHovered] = useState(false);
    const textRef = useRef<HTMLSpanElement>(null);
    const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as]);

    useEffect(() => {
        const updateUnderlineStyles = () => {
            if (textRef.current) {
                const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize);
                textRef.current.style.setProperty("--underline-height", `${fontSize * underlineHeightRatio}px`);
                textRef.current.style.setProperty("--underline-padding", `${fontSize * underlinePaddingRatio}px`);
            }
        };

        updateUnderlineStyles();
        window.addEventListener("resize", updateUnderlineStyles);
        return () => window.removeEventListener("resize", updateUnderlineStyles);
    }, [underlineHeightRatio, underlinePaddingRatio]);

    return (
        <MotionComponent
            className={cn("relative inline-block", className)}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            ref={textRef}
            {...props}
        >
            <span>{children}</span>
            <motion.div
                className="absolute left-1/2 bg-current -translate-x-1/2"
                style={{
                    height: "var(--underline-height)",
                    bottom: "calc(-1 * var(--underline-padding))",
                }}
                initial={false}
                animate={{ width: hovered ? "100%" : 0 }}
                transition={transition}
                aria-hidden="true"
            />
        </MotionComponent>
    );
}
