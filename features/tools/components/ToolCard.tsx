import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolDefinition } from "@/features/tools/types";
import { CATEGORY_STYLES, ToolIcon } from "./ToolIcon";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
    return (
        <Link
            href={`/tools/${tool.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-hairline bg-canvas p-5 transition-all hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-[0_10px_30px_rgba(26,26,26,0.08)]"
        >
            <div className="flex items-start justify-between gap-3">
                <ToolIcon slug={tool.slug} category={tool.category} />
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] ${CATEGORY_STYLES[tool.category].chip}`}>
                    {tool.category}
                </span>
            </div>
            <h3 className="mt-5 font-display text-xl font-medium text-ink">{tool.name}</h3>
            <p className="mt-1.5 flex-1 text-sm text-slate">{tool.shortDescription}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.6px] text-primary-brand">
                Open calculator <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
        </Link>
    );
}
