// app/sitemap.ts

import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";
import { getAllServiceSlugs } from "@/features/services/api/services.content";
import { getAllJobSlugs } from "@/features/careers/api/jobs.service";
import { getAllArticleSlugs } from "@/features/articles/api/articles.service";
import { techTemplates } from "@/features/marketing/data/tech-templates";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; changeFrequency: SitemapEntry["changeFrequency"]; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/services", changeFrequency: "weekly", priority: 0.9 },
    { path: "/bundles", changeFrequency: "weekly", priority: 0.8 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.6 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/franchise", changeFrequency: "monthly", priority: 0.6 },
    { path: "/tech-services", changeFrequency: "monthly", priority: 0.7 },
    { path: "/tech-services/templates", changeFrequency: "monthly", priority: 0.5 },
    { path: "/article", changeFrequency: "daily", priority: 0.8 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.2 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/cookies-policy", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [serviceSlugs, jobSlugs, articleSlugs] = await Promise.all([
        getAllServiceSlugs(),
        getAllJobSlugs(),
        getAllArticleSlugs(),
    ]);

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
        url: absoluteUrl(path),
        changeFrequency,
        priority,
    }));

    const serviceEntries: MetadataRoute.Sitemap = serviceSlugs
        .filter((s) => !s.isBundle)
        .map((s) => ({
            url: absoluteUrl(`/services/${s.slug}`),
            lastModified: s._updatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        }));

    const bundleEntries: MetadataRoute.Sitemap = serviceSlugs
        .filter((s) => s.isBundle)
        .map((s) => ({
            url: absoluteUrl(`/bundles/${s.slug}`),
            lastModified: s._updatedAt,
            changeFrequency: "weekly",
            priority: 0.7,
        }));

    const jobEntries: MetadataRoute.Sitemap = jobSlugs.map((j) => ({
        url: absoluteUrl(`/careers/${j.slug}`),
        lastModified: j._updatedAt,
        changeFrequency: "weekly",
        priority: 0.5,
    }));

    const articleEntries: MetadataRoute.Sitemap = articleSlugs.map((a) => ({
        url: absoluteUrl(`/article/${a.slug}`),
        lastModified: a._updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    const templateEntries: MetadataRoute.Sitemap = techTemplates.map((t) => ({
        url: absoluteUrl(`/tech-services/templates/${t.slug}`),
        changeFrequency: "monthly",
        priority: 0.4,
    }));

    return [...staticEntries, ...serviceEntries, ...bundleEntries, ...jobEntries, ...articleEntries, ...templateEntries];
}
