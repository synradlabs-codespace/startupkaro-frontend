import type { Metadata } from "next";
import { ToolsHubPage, HUB_FAQS } from "@/features/tools/components/ToolsHubPage";
import { TOOLS } from "@/features/tools/data/tools.registry";
import { TAX_YEAR_LABEL } from "@/features/tools/data/tax-rules";
import { buildMetadata } from "@/lib/seo/metadata";
import { ogImageUrl } from "@/lib/seo/og";
import { breadcrumbListJsonLd, faqPageJsonLd, itemListJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = buildMetadata({
    title: "Free Financial Calculators for India",
    description: `${TOOLS.length} free financial calculators for India: income tax (${TAX_YEAR_LABEL}), capital gains, advance tax, salary, HRA, TDS, GST, SIP, NPS, PPF, FD, RD, EMI, Pvt Ltd vs LLP and more.`,
    path: "/tools",
    keywords: ["financial calculators", "free financial tools india", "income tax calculator", "salary calculator", "sip calculator", "emi calculator", "gst calculator", "tds calculator", "ppf calculator"],
    image: { url: ogImageUrl("Free Financial Calculators for India", "Free Tools"), alt: "Free Financial Calculators | StartupKaro" },
});

export default function ToolsPage() {
    return (
        <>
            <JsonLd data={itemListJsonLd("Free Financial Calculators", TOOLS.map((t) => ({ name: t.name, path: `/tools/${t.slug}` })))} />
            <JsonLd data={faqPageJsonLd(HUB_FAQS)} />
            <JsonLd data={breadcrumbListJsonLd([{ name: "Home", path: "/" }, { name: "Free Tools", path: "/tools" }])} />
            <ToolsHubPage />
        </>
    );
}
