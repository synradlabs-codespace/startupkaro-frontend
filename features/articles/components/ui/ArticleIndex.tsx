"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/features/articles/lib/article-headings";

interface ArticleIndexProps {
    headings: ArticleHeading[];
}

const levelClassName: Record<ArticleHeading["level"], string> = {
    1: "pl-0 font-semibold text-ink",
    2: "pl-3 text-slate",
    3: "pl-6 text-stone",
};

export function ArticleIndex({ headings }: ArticleIndexProps) {
    const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

    function handleClick(id: string) {
        const element = document.getElementById(id);
        if (!element) return;

        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", `#${id}`);
        setActiveId(id);
    }

    useEffect(() => {
        if (headings.length === 0) return;

        const elements = headings
            .map((heading) => document.getElementById(heading.id))
            .filter((element): element is HTMLElement => Boolean(element));

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible[0]?.target.id) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-20% 0px -65% 0px",
                threshold: [0, 1],
            }
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav aria-label="Article sections" className="max-h-[calc(100vh-12rem)] overflow-y-auto border-l border-hairline pl-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28px] text-steel">
                On this page
            </p>
            <ol className="space-y-1.5">
                {headings.map((heading) => {
                    const isActive = heading.id === activeId;

                    return (
                        <li key={heading.key}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(event) => {
                                    event.preventDefault();
                                    handleClick(heading.id);
                                }}
                                className={[
                                    "block border-l-2 py-1.5 pr-1 text-xs leading-snug transition-colors",
                                    levelClassName[heading.level],
                                    isActive
                                        ? "border-primary-brand text-ink"
                                        : "border-transparent hover:border-hairline-strong hover:text-ink",
                                ].join(" ")}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
