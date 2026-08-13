import type { Metadata } from "next";
import { getTechArticles } from "@/features/articles/api/articles.service";
import { TechServicesPage } from "@/features/marketing/components/TechServicesPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Tech Services",
    description:
        "Websites, apps, and dashboards for Indian startups, from a simple landing page to a custom operating dashboard, built by the same team helping founders register, manage, and grow.",
    path: "/tech-services",
});

export default async function Page() {
    const articles = await getTechArticles(3);
    return <TechServicesPage articles={articles} />;
}
