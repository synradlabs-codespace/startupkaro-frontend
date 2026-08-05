import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { techTemplates } from "@/features/marketing/data/tech-templates";

export default function Page() {
    return (
        <main className="bg-canvas">
            <section className="border-b border-hairline bg-canvas px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Link href="/tech-services" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-brand hover:text-primary-deep">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tech
                    </Link>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28px] text-graphite">Template Library</p>
                    <h1 className="max-w-3xl font-display text-4xl font-medium leading-tight text-ink md:text-6xl">
                        Landing page templates for practical startup launches
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal">
                        Start with a focused page structure, then adapt the content to your offer. More templates can be added here without changing the main Tech page.
                    </p>
                </div>
            </section>

            <section className="bg-cloud px-4 py-14 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
                    {techTemplates.map((template) => (
                        <Link key={template.slug} href={`/tech-services/templates/${template.slug}`} className="group rounded-2xl border border-hairline bg-canvas p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-brand">
                            <div className="mb-5 overflow-hidden rounded-lg border border-hairline bg-surface">
                                <div className="relative aspect-[4/5] w-full">
                                    <Image
                                        src={template.image}
                                        alt={template.imageAlt}
                                        fill
                                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                    />
                                </div>
                            </div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28px] text-primary-brand">{template.type}</p>
                            <h2 className="mt-2 font-display text-2xl font-medium text-ink group-hover:text-primary-brand">{template.name}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-charcoal">{template.description}</p>
                            <div className="mt-5 space-y-2">
                                {template.snapshot.slice(0, 3).map((item) => (
                                    <p key={item} className="flex items-center gap-2 text-sm font-medium text-charcoal">
                                        <CheckCircle2 className="h-4 w-4 text-primary-brand" />
                                        {item}
                                    </p>
                                ))}
                            </div>
                            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-brand">
                                View template
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
