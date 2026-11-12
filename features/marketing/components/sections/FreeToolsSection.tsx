// features/marketing/components/sections/FreeToolsSection.tsx
//
// Landing-page teaser for the free financial calculators. Sits with the
// Knowledge Hub in the "resources" part of the page: visitors who have seen
// the services, proof and process but aren't ready to buy get a useful,
// low-commitment next step instead of bouncing.

import { FlowSecondaryButton } from "@/components/custom/FlowButton";
import { FEATURED_TOOL_SLUGS, getTool } from "@/features/tools/data/tools.registry";
import { ToolCard } from "@/features/tools/components/ToolCard";
import type { ToolDefinition } from "@/features/tools/types";

export function FreeToolsSection() {
    const tools = FEATURED_TOOL_SLUGS.map(getTool).filter((t): t is ToolDefinition => Boolean(t));
    if (tools.length === 0) return null;

    return (
        <section className="bg-canvas py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-8">
                <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Free Tools</p>
                        <h2 className="font-display text-4xl font-medium leading-tight text-ink md:text-5xl">Plan your money in seconds</h2>
                        <p className="mt-3 text-base text-charcoal">
                            Free calculators for tax, investments and loans, kept up to date by our CA team. No sign-up, and you can share any result.
                        </p>
                    </div>
                    <FlowSecondaryButton href="/tools" text="See All Tools" iconName="arrow-right" wrapperClassName="shrink-0" />
                </div>

                <div className="rounded-2xl border border-hairline bg-cloud p-5 md:p-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {tools.map((tool) => (
                            <ToolCard key={tool.slug} tool={tool} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
