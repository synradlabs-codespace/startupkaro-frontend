import { Suspense } from "react";
import { Heart, ShieldCheck, Users, Zap } from "lucide-react";
import { FlowButton } from "@/components/custom/FlowButton";
import { JobFilters } from "./ui/JobFilters";
import { JobsGroupedList } from "./ui/JobsGroupedList";
import type { JobCard } from "@/features/careers/types";

const CULTURE_PILLARS = [
    {
        icon: ShieldCheck,
        title: "Compliance first",
        body: "We help founders stay compliant so we hold ourselves to the same standard, every process, every decision.",
    },
    {
        icon: Heart,
        title: "Zero spam, full trust",
        body: "We never sell data, never cold-spam, never overwhelm. Every communication earns its place.",
    },
    {
        icon: Users,
        title: "Expert, not corporate",
        body: "Real CAs, CSs, and legal experts, approachable, fast, and always in your corner.",
    },
    {
        icon: Zap,
        title: "Bias for action",
        body: "New-age founders move fast. So do we. Done beats perfect, and we ship, learn, and iterate.",
    },
];

interface CareersListPageProps {
    jobs: JobCard[];
}

export function CareersListPage({ jobs }: CareersListPageProps) {
    const uniqueLocations = [...new Set(jobs.map((j) => j.location))].sort();

    return (
        <main className="bg-canvas py-6">
            {/* Hero */}
            <section className="mx-4 max-w-7xl rounded-2xl border border-hairline bg-canvas px-8 py-20 sm:mx-6 md:py-28 lg:mx-auto">
                <div className="max-w-3xl">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                        Join our team
                    </p>
                    <h1 className="mb-6 font-display text-4xl font-medium leading-none text-ink sm:text-5xl md:text-6xl">
                        Build India&apos;s most{" "}
                        <span className="text-primary-brand">trusted</span>{" "}
                        compliance platform
                    </h1>
                    <p className="mb-8 max-w-2xl text-lg leading-relaxed text-charcoal">
                        We&apos;re on a mission to become India&apos;s most trusted compliance partner for new-age founders, making GST, registrations, and legal paperwork completely headache-free.
                    </p>
                    <div className="mb-8 flex flex-wrap gap-5 border-t border-hairline pt-5 text-xs text-graphite">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-primary-brand" />
                            Compliance-first culture
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4 text-primary-brand" />
                            Strict no-spam policy
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary-brand" />
                            Expert team, founder mindset
                        </span>
                    </div>
                    <FlowButton
                        href="#open-positions"
                        text="View Open Roles"
                        iconName="briefcase"
                        colorVariant="primary"
                    />
                </div>
            </section>

            {/* Culture pillars */}
            <section className="bg-cloud px-4 py-16 sm:px-6 md:py-20 lg:px-8">
                <div className="mb-10 text-center">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">How we work</p>
                    <h2 className="font-display text-3xl font-medium leading-snug text-ink md:text-4xl">
                        Life at StartupKaro
                    </h2>
                </div>
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {CULTURE_PILLARS.map(({ icon: Icon, title, body }) => (
                        <div
                            key={title}
                            className="flex flex-col rounded-xl border border-hairline bg-canvas px-6 pb-6 pt-6 transition-colors duration-200 hover:border-primary-brand"
                        >
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                                <Icon className="h-5 w-5 text-primary-brand" />
                            </div>
                            <h3 className="mb-1.5 text-sm font-medium text-ink">{title}</h3>
                            <p className="text-xs leading-relaxed text-charcoal">{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Job listings */}
            <section id="open-positions" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
                <div className="space-y-10">
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Open roles</p>
                        <h2 className="mb-2 font-display text-3xl font-medium leading-snug text-ink md:text-4xl">
                            Open Positions
                        </h2>
                        <p className="text-sm text-charcoal">
                            {jobs.length === 0
                                ? "No openings right now, check back soon."
                                : `${jobs.length} opening${jobs.length === 1 ? "" : "s"} across all departments`}
                        </p>
                    </div>

                    {jobs.length > 0 && (
                        <>
                            <Suspense>
                                <JobFilters locations={uniqueLocations} />
                            </Suspense>
                            <Suspense>
                                <JobsGroupedList jobs={jobs} />
                            </Suspense>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
