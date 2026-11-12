// features/tools/lib/related.ts
//
// Picks the free tools most relevant to a piece of content (e.g. an article)
// by matching its title, summary and category names against each tool's
// name, category and SEO keywords. Pure and server-safe.

import { FEATURED_TOOL_SLUGS, TOOLS, getTool } from "@/features/tools/data/tools.registry";
import type { ToolDefinition } from "@/features/tools/types";

const STOP_WORDS = new Set(["calculator", "india", "free", "tax", "the", "and", "for", "with", "your", "how", "what", "online", "vs"]);

function tokens(text: string): Set<string> {
    return new Set(
        text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    );
}

/**
 * Topic signals for content that rarely uses calculator keywords directly
 * (startup, company law, payroll articles). Each match adds a strong boost.
 */
const TOPIC_BOOSTS: { pattern: RegExp; slugs: string[] }[] = [
    { pattern: /\b(startup|dpiit|founder|incorporat|pvt ltd|private limited|llp|opc|one person company|proprietor|partnership|company registration)/, slugs: ["business-structure-calculator", "equity-dilution-calculator", "break-even-calculator"] },
    { pattern: /\b(funding|investor|angel|venture|esop|valuation|term sheet|cap table|shareholder)/, slugs: ["equity-dilution-calculator", "cagr-calculator", "business-structure-calculator"] },
    { pattern: /\b(roc|mca|aoc-4|mgt-7|annual return|director|board)/, slugs: ["business-structure-calculator", "gst-late-fee-calculator", "tds-calculator"] },
    { pattern: /\b(gst|gstr|input tax credit|e-way|invoice)/, slugs: ["gst-calculator", "gst-late-fee-calculator", "tds-calculator"] },
    { pattern: /\b(itr|income tax|tax regime|tax slab|deduction|80c|refund)/, slugs: ["income-tax-calculator", "hra-calculator", "advance-tax-calculator"] },
    { pattern: /\b(freelanc|consultant|presumptive|44ad|44ada|professional)/, slugs: ["presumptive-tax-calculator", "advance-tax-calculator", "tds-calculator"] },
    { pattern: /\b(salary|payroll|employee|epf|pf |gratuity|hra|labour code)/, slugs: ["salary-calculator", "gratuity-calculator", "hra-calculator"] },
    { pattern: /\b(export|import|fema|msme|udyam|loan|working capital)/, slugs: ["emi-calculator", "break-even-calculator", "gst-calculator"] },
    { pattern: /\b(invest|mutual fund|sip|retire|nps|ppf|capital gain)/, slugs: ["sip-calculator", "capital-gains-tax-calculator", "nps-calculator"] },
];

export function getRelatedTools(input: { title: string; summary?: string; categories?: string[] }, limit = 3): ToolDefinition[] {
    const haystack = `${input.title} ${input.summary ?? ""} ${(input.categories ?? []).join(" ")}`.toLowerCase();
    const words = tokens(haystack);
    const boosts = new Map<string, number>();
    for (const topic of TOPIC_BOOSTS) {
        if (!topic.pattern.test(haystack)) continue;
        // Earlier slugs in a topic are the better fit.
        topic.slugs.forEach((slug, i) => boosts.set(slug, (boosts.get(slug) ?? 0) + 12 - i * 2));
    }

    const scored = TOOLS.map((tool) => {
        let score = boosts.get(tool.slug) ?? 0;
        // Whole keyword phrases appearing in the text are the strongest signal.
        for (const kw of tool.keywords) if (haystack.includes(kw.toLowerCase())) score += 5;
        const toolName = tool.name.toLowerCase().replace(" calculator", "");
        if (haystack.includes(toolName)) score += 6;
        for (const w of tokens(`${tool.name} ${tool.keywords.join(" ")}`)) if (words.has(w)) score += 1;
        return { tool, score };
    })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((s) => s.tool);

    // Top up with featured tools so the section is never empty or short.
    const featured = FEATURED_TOOL_SLUGS.map(getTool).filter((t): t is ToolDefinition => Boolean(t));
    const picked: ToolDefinition[] = [];
    for (const tool of [...scored, ...featured]) {
        if (picked.length >= limit) break;
        if (!picked.some((p) => p.slug === tool.slug)) picked.push(tool);
    }
    return picked;
}
