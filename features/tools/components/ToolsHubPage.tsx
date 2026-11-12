// features/tools/components/ToolsHubPage.tsx

import { Share2, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingCTASection } from "@/features/marketing/components/sections/MarketingCTASection";
import { TOOLS, TOOL_CATEGORIES } from "@/features/tools/data/tools.registry";
import { TAX_YEAR_LABEL } from "@/features/tools/data/tax-rules";
import { ToolFAQ } from "./ToolFAQ";
import { ToolsGrid } from "./ToolsGrid";

export const HUB_FAQS = [
    { question: "Are these financial calculators really free?", answer: "Yes. Every StartupKaro calculator is free to use with no sign-up and no limits. Your inputs stay in your browser and are only added to the page link so you can share results." },
    { question: "How accurate are the results?", answer: `The calculators use the standard formulas used by Indian banks and fund houses, and tax tools use the latest ${TAX_YEAR_LABEL} rules. Results are estimates for planning; actual figures can differ slightly based on lender and product terms.` },
    { question: "Can I share my calculation with someone?", answer: "Yes. Every tool has a Copy link button that opens the exact same calculation for whoever you send it to, plus a downloadable image of your result for WhatsApp, Instagram or email." },
    { question: "Can StartupKaro help me act on the results?", answer: "Yes. Our CA, CS and legal experts can file your income tax return, register you for GST, plan your taxes or help your business raise a loan. Each tool links to the related service." },
];

export function ToolsHubPage() {
    return (
        <>
            <section className="bg-canvas pb-12 pt-10 md:pb-16 md:pt-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">Free Tools</p>
                        <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink md:text-6xl">Free Financial Calculators for India</h1>
                        <p className="mt-5 text-lg leading-relaxed text-charcoal">
                            Plan your taxes, investments and loans in seconds. Accurate, up to date for {TAX_YEAR_LABEL} and built by the team that files thousands of returns and registrations every year.
                        </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-charcoal">
                        <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary-brand" /> 100% free, no sign-up</span>
                        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary-brand" /> Latest {TAX_YEAR_LABEL} rules</span>
                        <span className="inline-flex items-center gap-2"><Share2 className="h-4 w-4 text-primary-brand" /> Share results as a link or image</span>
                    </div>
                </div>
            </section>

            <section className="bg-surface py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ToolsGrid tools={TOOLS} categories={TOOL_CATEGORIES} />
                </div>
            </section>

            <ToolFAQ faqs={HUB_FAQS} />

            <div className="py-14 md:py-18">
                <MarketingCTASection
                    eyebrow="Beyond calculators"
                    title="Let experts handle the paperwork"
                    description="From ITR filing to GST registration and bookkeeping, StartupKaro's CA and CS team gets it done at a fixed price."
                />
            </div>
        </>
    );
}
