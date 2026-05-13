"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type UnderlineAnimationProps = {
    children: ReactNode;
    className?: string;
    lineClassName?: string;
};

export function UnderlineAnimation({
    children,
    className,
    lineClassName,
}: UnderlineAnimationProps) {
    return (
        <span className={cn("relative inline-block", className)}>
            {children}
            <span
                aria-hidden="true"
                className={cn(
                    "absolute -bottom-0.5 left-1/2 h-px w-full origin-center -translate-x-1/2 scale-x-0 bg-primary-brand transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-100",
                    lineClassName
                )}
            />
        </span>
    );
}
