import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { getTechTemplateBySlug, techTemplates } from "@/features/marketing/data/tech-templates";

export function generateStaticParams() {
    return techTemplates.map((template) => ({ slug: template.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const template = getTechTemplateBySlug(slug);
    if (!template) notFound();

    return (
        <main className="bg-canvas">
            <section className="border-b border-hairline bg-canvas px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Link href="/tech-services/templates" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-brand hover:text-primary-deep">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Templates
                    </Link>
                    <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">{template.type}</p>
                            <h1 className="font-display text-4xl font-medium leading-tight text-ink md:text-6xl">{template.name}</h1>
                            <p className="mt-5 text-base leading-relaxed text-charcoal">{template.description}</p>
                            <p className="mt-4 rounded-xl border border-hairline bg-surface p-4 text-sm leading-relaxed text-charcoal">
                                <span className="font-semibold text-ink">Who it is for: </span>{template.audience}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-hairline bg-cloud p-3 md:p-5">
                            <div className="overflow-hidden rounded-xl border border-hairline bg-canvas shadow-[0_18px_52px_rgba(26,26,26,0.08)]">
                                <div className="relative aspect-[4/5] w-full">
                                    <Image
                                        src={template.image}
                                        alt={template.imageAlt}
                                        fill
                                        priority
                                        className="object-cover object-top"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-surface px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28px] text-graphite">Design rationale</p>
                        <h2 className="font-display text-3xl font-medium text-ink md:text-5xl">Why this template was made this way</h2>
                    </div>
                    <p className="text-base leading-relaxed text-charcoal">{template.rationale}</p>
                </div>
            </section>

            <section className="bg-canvas px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
                        <h2 className="font-display text-2xl font-medium text-ink">Snapshot</h2>
                        <div className="mt-5 space-y-3">
                            {template.snapshot.map((item) => (
                                <p key={item} className="flex items-center gap-2 text-sm font-medium text-charcoal">
                                    <CheckCircle2 className="h-4 w-4 text-primary-brand" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-hairline bg-cloud p-6">
                        <h2 className="font-display text-2xl font-medium text-ink">Included sections</h2>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {template.sections.map((section) => (
                                <span key={section} className="rounded-md border border-hairline bg-canvas px-3 py-2 text-xs font-semibold uppercase tracking-[0.24px] text-graphite">
                                    {section}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-cloud px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">Start with this template</p>
                    <h2 className="font-display text-3xl font-medium text-ink md:text-5xl">Use {template.name} for your landing page</h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal">
                        The template package is Rs. 15,000 and includes a responsive page design with up to 3 content revisions.
                    </p>
                    <Link href={`/tech-services#quote`} className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary-brand px-6 text-xs font-semibold uppercase tracking-[0.28px] text-white transition-colors hover:bg-primary-deep">
                        Request this template
                        <Send className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
