import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JobDetailPage } from "@/features/careers/components/JobDetailPage";
import { getJobBySlug, getAllJobSlugs } from "@/features/careers/api/jobs.service";
import { SanityLive } from "@/sanity/live";
import { buildMetadata } from "@/lib/seo/metadata";
import { NOINDEX } from "@/lib/seo/site";
import { breadcrumbListJsonLd, jobPostingJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateStaticParams() {
    return getAllJobSlugs();
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const job = await getJobBySlug(slug);
    if (!job) return NOINDEX;

    return buildMetadata({
        title: job.title,
        description: job.shortDescription,
        path: `/careers/${slug}`,
        ogLabel: "Careers",
    });
}

export default async function JobPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const job = await getJobBySlug(slug);
    if (!job) notFound();

    return (
        <>
            <JsonLd
                data={jobPostingJsonLd({
                    title: job.title,
                    description: job.shortDescription,
                    path: `/careers/${slug}`,
                    datePosted: job.publishedAt,
                    employmentType: job.workType === "Internship" ? "INTERN" : "FULL_TIME",
                    location: job.location,
                    isRemote: job.isRemote,
                })}
            />
            <JsonLd
                data={breadcrumbListJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Careers", path: "/careers" },
                    { name: job.title, path: `/careers/${slug}` },
                ])}
            />
            <JobDetailPage job={job} />
            <SanityLive />
        </>
    );
}
