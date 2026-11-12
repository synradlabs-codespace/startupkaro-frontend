import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ToolPage } from "@/features/tools/components/ToolPage";
import { getAllToolSlugs, getTool } from "@/features/tools/data/tools.registry";
import { getEngine } from "@/features/tools/lib/engines";
import { hasInputParams, parseInputs, serializeInputs } from "@/features/tools/lib/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { ogImageUrl, toolCardUrl } from "@/lib/seo/og";
import { NOINDEX } from "@/lib/seo/site";
import { breadcrumbListJsonLd, faqPageJsonLd, webApplicationJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function generateStaticParams() {
    return getAllToolSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: SearchParams }): Promise<Metadata> {
    const { slug } = await params;
    const tool = getTool(slug);
    const engine = getEngine(slug);
    if (!tool || !engine) return NOINDEX;

    const raw = await searchParams;
    // Shared result links preview the sender's numbers; the canonical stays the
    // bare /tools/<slug> so these variants are never indexed as duplicates.
    const image = hasInputParams(engine.fields, raw)
        ? { url: toolCardUrl(slug, serializeInputs(engine.fields, parseInputs(engine.fields, raw))), alt: `${tool.name} result | StartupKaro` }
        : { url: ogImageUrl(tool.ogTitle, "Free Tool"), alt: `${tool.name} | StartupKaro` };

    return buildMetadata({
        title: tool.metaTitle,
        description: tool.metaDescription,
        path: `/tools/${slug}`,
        ogTitle: tool.ogTitle,
        keywords: tool.keywords,
        image,
    });
}

export default async function ToolSlugPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
    const { slug } = await params;
    const tool = getTool(slug);
    const engine = getEngine(slug);
    if (!tool || !engine) notFound();

    const raw = await searchParams;
    const initial = parseInputs(engine.fields, raw);
    const isShared = hasInputParams(engine.fields, raw);

    return (
        <>
            <JsonLd
                data={webApplicationJsonLd({
                    name: tool.name,
                    description: tool.metaDescription,
                    path: `/tools/${slug}`,
                    dateModified: tool.lastReviewed,
                })}
            />
            <JsonLd data={faqPageJsonLd(tool.faqs)} />
            <JsonLd
                data={breadcrumbListJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Free Tools", path: "/tools" },
                    { name: tool.name, path: `/tools/${slug}` },
                ])}
            />
            <ToolPage tool={tool} initial={initial} isShared={isShared} />
        </>
    );
}
