"use client";

import { useState } from "react";
import type { ToolCategory, ToolDefinition } from "@/features/tools/types";
import { cn } from "@/lib/utils";
import { ToolCard } from "./ToolCard";

export function ToolsGrid({ tools, categories }: { tools: ToolDefinition[]; categories: ToolCategory[] }) {
    const [active, setActive] = useState<ToolCategory | "All">("All");
    const visible = active === "All" ? tools : tools.filter((t) => t.category === active);

    return (
        <>
            <div role="tablist" aria-label="Filter tools by category" className="flex flex-wrap gap-2">
                {(["All", ...categories] as const).map((cat) => {
                    const selected = cat === active;
                    return (
                        <button
                            key={cat}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setActive(cat)}
                            className={cn(
                                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.5px] transition-colors",
                                selected ? "border-ink bg-ink text-white" : "border-hairline bg-canvas text-charcoal hover:border-ink hover:text-ink"
                            )}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>
            {/* All cards stay in the DOM order for crawlers; filtering is visual only on the client. */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                ))}
            </div>
        </>
    );
}
