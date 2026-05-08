import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JobDetailPage } from "@/features/careers/components/JobDetailPage";
import { getJobBySlug, getAllJobSlugs } from "@/features/careers/api/jobs.service";
import { SanityLive } from "@/sanity/live";

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
    if (!job) return {};

    return {
        title: `${job.title} | StartupKaro Careers`,
        description: job.shortDescription,
    };
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
            <JobDetailPage job={job} />
            <SanityLive />
        </>
    );
}
