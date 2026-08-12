import type { Metadata } from "next";
import { CareersListPage } from "@/features/careers/components/CareersListPage";
import { getActiveJobs } from "@/features/careers/api/jobs.service";
import { SanityLive } from "@/sanity/live";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Careers",
    description:
        "Join StartupKaro and help build India's most trusted compliance platform for new-age founders. Browse open positions across Advisory, Technical, HR, and Marketing.",
    path: "/careers",
});

export default async function CareersPage() {
    const jobs = await getActiveJobs();

    return (
        <>
            <CareersListPage jobs={jobs} />
            <SanityLive />
        </>
    );
}
