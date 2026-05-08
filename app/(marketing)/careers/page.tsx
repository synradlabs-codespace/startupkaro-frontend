import type { Metadata } from "next";
import { CareersListPage } from "@/features/careers/components/CareersListPage";
import { getActiveJobs } from "@/features/careers/api/jobs.service";
import { SanityLive } from "@/sanity/live";

export const metadata: Metadata = {
    title: "Careers | StartupKaro",
    description:
        "Join StartupKaro and help build India's most trusted compliance platform for new-age founders. Browse open positions across Advisory, Technical, HR, and Marketing.",
};

export default async function CareersPage() {
    const jobs = await getActiveJobs();

    return (
        <>
            <CareersListPage jobs={jobs} />
            <SanityLive />
        </>
    );
}
