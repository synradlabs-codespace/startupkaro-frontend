import { sanityFetch } from "@/sanity/live";
import { client } from "@/sanity/client";
import { JOBS_QUERY, JOB_BY_SLUG_QUERY, ALL_JOB_SLUGS_QUERY } from "@/sanity/queries";
import type { Job, JobCard } from "@/features/careers/types";

export async function getActiveJobs(): Promise<JobCard[]> {
    const result = await sanityFetch({
        query: JOBS_QUERY,
        tags: ["job"],
    });
    return (result.data ?? []) as JobCard[];
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
    const result = await sanityFetch({
        query: JOB_BY_SLUG_QUERY,
        params: { slug },
        tags: ["job", `job:${slug}`],
    });
    return (result.data ?? null) as Job | null;
}

// Uses the plain client — safe to call from generateStaticParams (no draftMode() call)
export async function getAllJobSlugs(): Promise<{ slug: string }[]> {
    const data = await client.fetch(ALL_JOB_SLUGS_QUERY);
    return (data ?? []) as { slug: string }[];
}
