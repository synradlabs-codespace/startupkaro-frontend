import { Suspense } from "react";
import { Heart, ShieldCheck, Users, Zap } from "lucide-react";
import { JobFilters } from "./ui/JobFilters";
import { JobsGroupedList } from "./ui/JobsGroupedList";
import type { JobCard } from "@/features/careers/types";

const CULTURE_PILLARS = [
    {
        icon: ShieldCheck,
        color: "#003c33",
        title: "Compliance first",
        body: "We help founders stay compliant so we hold ourselves to the same standard, every process, every decision.",
    },
    {
        icon: Heart,
        color: "#ff7759",
        title: "Zero spam, full trust",
        body: "We never sell data, never cold-spam, never overwhelm. Every communication earns its place.",
    },
    {
        icon: Users,
        color: "#071829",
        title: "Expert, not corporate",
        body: "Real CAs, CSs, and legal experts, approachable, fast, and always in your corner.",
    },
    {
        icon: Zap,
        color: "#ff7759",
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
        <main>
            {/* ── Hero / Vision ───────────────────────────────────────────── */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-4">
                            Join our team
                        </p>
                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-none text-ink mb-6">
                            Build India&apos;s most{" "}
                            <span className="text-coral">trusted</span>{" "}
                            compliance platform
                        </h1>
                        <p className="text-lg text-body-muted leading-relaxed mb-8 max-w-2xl">
                            We&apos;re on a mission to become India&apos;s most trusted compliance partner for new-age founders, making GST, registrations, and legal paperwork completely headache-free. If you believe businesses should focus on building, not bureaucracy, you&apos;ll fit right in.
                        </p>
                        <div className="flex flex-wrap gap-5 text-xs text-body-muted">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-deep-green" />
                                Compliance-first culture
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Heart className="h-4 w-4 text-coral" />
                                Strict no-spam policy
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-dark-navy" />
                                Expert team, founder mindset
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Culture pillars ─────────────────────────────────────────── */}
            <section className="bg-soft-stone py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-2">
                            How we work
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight leading-snug text-ink">
                            Life at StartupKaro
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CULTURE_PILLARS.map(({ icon: Icon, color, title, body }) => (
                            <div
                                key={title}
                                className="flex flex-col bg-white rounded-lg border-t-2 pt-6 px-6 pb-6"
                                style={{ borderTopColor: color }}
                            >
                                <div
                                    className="h-10 w-10 rounded-lg flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${color}1A` }}
                                >
                                    <Icon className="h-5 w-5" style={{ color }} />
                                </div>
                                <h3 className="text-sm font-medium text-ink mb-1.5">{title}</h3>
                                <p className="text-xs text-body-muted leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Job listings ────────────────────────────────────────────── */}
            <section className="bg-white py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                    <div>
                        <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight leading-snug text-ink mb-2">
                            Open Positions
                        </h2>
                        <p className="text-sm text-body-muted">
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
