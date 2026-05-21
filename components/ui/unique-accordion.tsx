"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItem {
    id: string;
    number: string;
    title: string;
    content: string;
}

interface UniqueAccordionProps {
    items: AccordionItem[];
    defaultOpenId?: string | null;
}

export function UniqueAccordion({ items, defaultOpenId = null }: UniqueAccordionProps) {
    const [activeId, setActiveId] = React.useState<string | null>(defaultOpenId);
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    return (
        <div className="w-full">
            <div className="space-y-0">
                {items.map((item) => {
                    const isActive = activeId === item.id;
                    const isHovered = hoveredId === item.id;

                    return (
                        <div key={item.id}>
                            <motion.button
                                onClick={() => setActiveId(isActive ? null : item.id)}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="group relative w-full"
                                initial={false}
                            >
                                <div className="flex items-center gap-4 px-1 py-4">
                                    <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-primary-brand"
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1 : isHovered ? 0.85 : 0,
                                                opacity: isActive ? 1 : isHovered ? 0.15 : 0,
                                            }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        />
                                        <motion.span
                                            className="relative z-10 text-xs font-medium tracking-wide font-sans"
                                            animate={{
                                                color: isActive ? "#ffffff" : isHovered ? "#296ef9" : "#636363",
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {item.number}
                                        </motion.span>
                                    </div>

                                    <motion.h3
                                        className="text-left text-sm font-medium leading-snug font-sans"
                                        animate={{
                                            x: isActive || isHovered ? 4 : 0,
                                            color: isActive || isHovered ? "#1a1a1a" : "#3d3d3d",
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        {item.title}
                                    </motion.h3>

                                    <div className="ml-auto flex items-center gap-3">
                                        <motion.div
                                            className="flex h-8 w-8 items-center justify-center"
                                            animate={{ rotate: isActive ? 45 : 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            <motion.svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 16 16"
                                                fill="none"
                                                animate={{ opacity: isActive || isHovered ? 1 : 0.4 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <motion.path
                                                    d="M8 1V15M1 8H15"
                                                    stroke="#1a1a1a"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    initial={false}
                                                />
                                            </motion.svg>
                                        </motion.div>
                                    </div>
                                </div>

                                <motion.div className="absolute bottom-0 left-0 right-0 h-px origin-left bg-hairline" initial={false} />
                                <motion.div
                                    className="absolute bottom-0 left-0 h-px origin-left bg-primary-brand"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: isActive ? 1 : isHovered ? 0.3 : 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            </motion.button>

                            <AnimatePresence mode="wait">
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                            transition: {
                                                height: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2, delay: 0.1 },
                                            },
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                            transition: {
                                                height: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.1 },
                                            },
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <motion.p
                                            className="pb-4 pl-11 pr-4 pt-2 text-sm leading-relaxed text-charcoal font-sans"
                                            initial={{ y: -10 }}
                                            animate={{ y: 0 }}
                                            exit={{ y: -10 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            {item.content}
                                        </motion.p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
