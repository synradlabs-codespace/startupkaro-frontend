import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { UniqueAccordion } from "@/components/ui/unique-accordion";
import { portableTextComponents } from "@/features/articles/lib/portable-text-components";
import type { ServiceContent } from "@/features/services/types/content.types";

interface ServiceEditorialProps {
    content: ServiceContent;
}

// Shared server-renderable editorial blocks used by both the customer panel
// and marketing service detail pages. Panel-specific CTAs (price card, checkout
// link, marketing pricing section) are rendered by each panel separately.
export function ServiceEditorial({ content }: ServiceEditorialProps) {
    return (
        <div className="space-y-0">
            {/* Hero image + tagline */}
            {content.heroImage?.url && (
                <section className="relative w-full overflow-hidden rounded-2xl bg-surface aspect-[3/1] max-h-64">
                    <Image
                        src={content.heroImage.url}
                        alt={content.heroImage.alt ?? content.name}
                        fill
                        className="object-cover"
                        placeholder={content.heroImage.lqip ? "blur" : "empty"}
                        blurDataURL={content.heroImage.lqip}
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                    <p className="absolute bottom-5 left-6 right-6 font-display text-xl font-medium text-white leading-snug">
                        {content.tagline}
                    </p>
                </section>
            )}

            {/* Overview — rich text */}
            {content.overview?.length > 0 && (
                <section className="bg-canvas py-10">
                    <div className="space-y-5">
                        <PortableText value={content.overview} components={portableTextComponents} />
                    </div>
                </section>
            )}

            {/* What's included */}
            {content.whatsIncluded?.length > 0 && (
                <section className="bg-surface rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-4">
                        <CheckCircle2 className="h-4 w-4 text-primary-brand" />
                        What&apos;s Included
                    </h3>
                    <ul className="space-y-3">
                        {content.whatsIncluded.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-primary-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <ShieldCheck className="h-3 w-3 text-primary-brand" />
                                </div>
                                <span className="text-sm text-slate">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Process steps */}
            {content.process?.length > 0 && (
                <section className="bg-cloud rounded-xl p-6">
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Process</p>
                    <h3 className="mb-6 font-display text-xl font-medium text-ink">How we process your request</h3>
                    <div className="rounded-xl border border-hairline bg-canvas p-5 space-y-0">
                        {content.process.map((step, idx) => (
                            <div key={step.title} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-brand text-xs font-medium text-white">
                                        {idx + 1}
                                    </div>
                                    {idx < content.process.length - 1 && (
                                        <div className="w-px flex-1 bg-hairline my-2" />
                                    )}
                                </div>
                                <div className={idx < content.process.length - 1 ? "pb-6" : ""}>
                                    <p className="mb-1 mt-1 text-sm font-medium text-ink leading-none">{step.title}</p>
                                    <p className="text-sm leading-relaxed text-charcoal">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* FAQs */}
            {content.faqs?.length > 0 && (
                <section className="bg-canvas py-10">
                    <p className="mb-1 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Questions</p>
                    <h3 className="mb-6 font-display text-xl font-medium text-ink">Frequently asked questions</h3>
                    <UniqueAccordion
                        items={content.faqs.map((faq, idx) => ({
                            id: String(idx),
                            number: String(idx + 1).padStart(2, "0"),
                            title: faq.question,
                            content: faq.answer,
                        }))}
                        defaultOpenId="0"
                    />
                </section>
            )}
        </div>
    );
}
