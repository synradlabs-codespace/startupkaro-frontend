// features/tools/components/ToolPage.tsx
//
// Server-rendered layout shared by every tool. All SEO copy is in the HTML;
// only <ToolCalculator> hydrates. The calculator is SSR'd with the parsed
// inputs, so crawlers and shared-link visitors see real numbers immediately.

import Link from "next/link";
import { UnderlineAnimation } from "@/components/fancy/text";
import { ChevronRight, Info } from "lucide-react";
import { MarketingCTASection } from "@/features/marketing/components/sections/MarketingCTASection";
import type { ToolDefinition } from "@/features/tools/types";
import type { ToolInputs } from "@/features/tools/lib/params";
import { getTool } from "@/features/tools/data/tools.registry";
import { ToolCalculator } from "./ToolCalculator";
import { ToolFAQ } from "./ToolFAQ";
import { ToolCard } from "./ToolCard";
import { CATEGORY_STYLES } from "./ToolIcon";

function formatReviewed(iso: string) {
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function ToolPage({ tool, initial, isShared }: { tool: ToolDefinition; initial: ToolInputs; isShared: boolean }) {
    const related = tool.related.map(getTool).filter((t): t is ToolDefinition => Boolean(t));

    return (
        <>
            <section className="bg-canvas pb-12 pt-8 md:pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-slate">
                        <Link href="/" className="hover:text-ink">Home</Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <Link href="/tools" className="hover:text-ink">Free Tools</Link>
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span aria-current="page" className="text-charcoal">{tool.name}</span>
                    </nav>

                    <div className="mt-6 max-w-3xl">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] ${CATEGORY_STYLES[tool.category].chip}`}>
                            Free {tool.category.toLowerCase()} tool
                        </span>
                        <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-ink md:text-5xl">{tool.h1}</h1>
                        <p className="mt-4 text-base leading-relaxed text-charcoal">{tool.intro[0]}</p>
                        <p className="mt-3 text-xs text-slate">
                            Free, no sign-up · Last reviewed <time dateTime={tool.lastReviewed}>{formatReviewed(tool.lastReviewed)}</time>
                        </p>
                    </div>

                    <div className="mt-8">
                        <ToolCalculator slug={tool.slug} name={tool.name} category={tool.category} initial={initial} isShared={isShared} />
                    </div>
                </div>
            </section>

            <section className="bg-surface py-14 md:py-18">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:px-8">
                    <article className="space-y-10">
                        {tool.intro.slice(1).map((p) => (
                            <p key={p.slice(0, 32)} className="text-base leading-relaxed text-charcoal">{p}</p>
                        ))}

                        <div>
                            <h2 className="font-display text-3xl font-medium text-ink">{tool.formula.heading}</h2>
                            <div className="mt-5 overflow-x-auto rounded-xl border border-hairline bg-canvas px-5 py-4">
                                <p className="whitespace-nowrap font-display text-lg font-medium text-ink">{tool.formula.expression}</p>
                            </div>
                            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                                {tool.formula.legend.map((item) => (
                                    <div key={item.symbol} className="rounded-lg border border-hairline bg-canvas p-3">
                                        <dt className="text-sm font-semibold text-ink">{item.symbol}</dt>
                                        <dd className="mt-0.5 text-sm text-slate">{item.meaning}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="mt-5 space-y-4">
                                {tool.formula.explanation.map((p) => (
                                    <p key={p.slice(0, 32)} className="text-base leading-relaxed text-charcoal">{p}</p>
                                ))}
                            </div>
                        </div>

                        {tool.sections.map((section) => (
                            <div key={section.heading}>
                                <h2 className="font-display text-3xl font-medium text-ink">{section.heading}</h2>
                                <div className="mt-4 space-y-4">
                                    {section.paragraphs.map((p) => (
                                        <p key={p.slice(0, 32)} className="text-base leading-relaxed text-charcoal">{p}</p>
                                    ))}
                                </div>
                                {section.bullets && (
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-base text-charcoal marker:text-primary-brand">
                                        {section.bullets.map((b) => <li key={b.slice(0, 32)}>{b}</li>)}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </article>

                    <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                        <div className="rounded-2xl border border-hairline bg-canvas p-6">
                            <p className="text-xs font-medium uppercase tracking-[0.5px] text-slate">Worked example</p>
                            <h2 className="mt-2 font-display text-2xl font-medium text-ink">{tool.example.heading}</h2>
                            <ol className="mt-4 space-y-3">
                                {tool.example.steps.map((step, i) => (
                                    <li key={step.slice(0, 32)} className="flex gap-3 text-sm leading-relaxed text-charcoal">
                                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tint-sky text-[11px] font-semibold text-primary-brand">{i + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                            <p className="mt-4 border-t border-hairline pt-4 text-sm font-medium text-ink">{tool.example.conclusion}</p>
                        </div>
                        <div className="rounded-2xl border border-hairline bg-canvas p-6">
                            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                                <Info className="h-4 w-4 text-primary-brand" /> Assumptions
                            </p>
                            <ul className="mt-3 space-y-2 text-sm text-slate">
                                {tool.assumptions.map((a) => <li key={a}>{a}</li>)}
                            </ul>
                            <p className="mt-4 text-xs leading-relaxed text-slate">
                                Results are estimates for planning and are not financial, tax or legal advice. Please confirm with a qualified professional before acting on them.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>

            <ToolFAQ faqs={tool.faqs} heading={`${tool.name}: frequently asked questions`} />

            {related.length > 0 && (
                <section className="bg-surface py-14 md:py-18">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Keep planning</p>
                                <h2 className="font-display text-3xl font-medium text-ink">Related free tools</h2>
                            </div>
                            <Link href="/tools" className="group text-sm font-semibold text-primary-brand">
                                <UnderlineAnimation lineClassName="bg-primary-brand">All Financial Tools</UnderlineAnimation>
                            </Link>
                        </div>
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
                        </div>
                    </div>
                </section>
            )}

            <div className="py-14 md:py-18">
                <MarketingCTASection
                    eyebrow={tool.serviceCta.eyebrow}
                    title={tool.serviceCta.title}
                    description={tool.serviceCta.description}
                    primaryText={tool.serviceCta.label}
                    primaryHref={tool.serviceCta.href}
                />
            </div>
        </>
    );
}
