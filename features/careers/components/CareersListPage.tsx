import { Suspense } from "react";
import { Heart, ShieldCheck, Users, Zap } from "lucide-react";
import { JobFilters } from "./ui/JobFilters";
import { JobsGroupedList } from "./ui/JobsGroupedList";
import type { JobCard } from "@/features/careers/types";

const CULTURE_PILLARS = [
    {
        icon: ShieldCheck,
        tint: "bg-tint-mint",
        title: "Compliance first",
        body: "We help founders stay compliant so we hold ourselves to the same standard, every process, every decision.",
    },
    {
        icon: Heart,
        tint: "bg-tint-peach",
        title: "Zero spam, full trust",
        body: "We never sell data, never cold-spam, never overwhelm. Every communication earns its place.",
    },
    {
        icon: Users,
        tint: "bg-tint-sky",
        title: "Expert, not corporate",
        body: "Real CAs, CSs, and legal experts, approachable, fast, and always in your corner.",
    },
    {
        icon: Zap,
        tint: "bg-tint-lavender",
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
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            {/* Hero */}
            <section className="bg-tint-sky rounded-2xl px-8 py-20 md:py-28">
                <div className="max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-[0.28px] text-steel mb-4">
                        Join our team
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-none text-ink mb-6">
                        Build India&apos;s most{" "}
                        <span className="italic font-normal">trusted</span>{" "}
                        compliance platform
                    </h1>
                    <p className="text-lg text-slate leading-relaxed mb-8 max-w-2xl">
                        We&apos;re on a mission to become India&apos;s most trusted compliance partner for new-age founders, making GST, registrations, and legal paperwork completely headache-free.
                    </p>
                    <div className="flex flex-wrap gap-5 text-xs text-steel">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="h-4 w-4 text-charcoal" />
                            Compliance-first culture
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4 text-charcoal" />
                            Strict no-spam policy
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-charcoal" />
                            Expert team, founder mindset
                        </span>
                    </div>
                </div>
            </section>

            {/* Culture pillars */}
            <section className="bg-canvas rounded-2xl px-8 py-16 md:py-20">
                <div className="text-center mb-10">
                    <p className="text-xs font-medium uppercase tracking-[0.28px] text-steel mb-2">How we work</p>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-snug text-ink">
                        Life at StartupKaro
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {CULTURE_PILLARS.map(({ icon: Icon, tint, title, body }) => (
                        <div
                            key={title}
                            className={`flex flex-col ${tint} rounded-xl border border-hairline pt-6 px-6 pb-6`}
                        >
                            <div className="h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center mb-4">
                                <Icon className="h-5 w-5 text-charcoal" />
                            </div>
                            <h3 className="text-sm font-semibold text-ink mb-1.5">{title}</h3>
                            <p className="text-xs text-slate leading-relaxed">{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Job listings */}
            <section className="bg-canvas rounded-2xl px-8 py-16 md:py-20">
                <div className="space-y-10">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight leading-snug text-ink mb-2">
                            Open Positions
                        </h2>
                        <p className="text-sm text-slate">
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
