"use client";

import { cn } from "@/lib/utils";

type LetterSwapProps = {
    text: string;
    className?: string;
    stagger?: number;
};

export function LetterSwap({ text, className, stagger = 18 }: LetterSwapProps) {
    // Each letter is clipped to a single row so the swap animation can hide its duplicate.
    // The row is taller than 1em so descenders (g, y, p, q, j) are not cut off, and the
    // negative margin keeps the overall line height the same as a 1em row.
    return (
        <span className={cn("-my-[0.15em] inline-flex overflow-hidden align-baseline leading-none", className)} aria-label={text}>
            {Array.from(text).map((char, index) => {
                const value = char === " " ? "\u00a0" : char;

                return (
                    <span
                        key={`${char}-${index}`}
                        className="relative inline-block h-[1.3em] overflow-hidden"
                        aria-hidden="true"
                    >
                        <span
                            className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                            style={{ transitionDelay: `${index * stagger}ms` }}
                        >
                            <span className="h-[1.3em] leading-[1.3em]">{value}</span>
                            <span className="h-[1.3em] leading-[1.3em]">{value}</span>
                        </span>
                    </span>
                );
            })}
        </span>
    );
}
