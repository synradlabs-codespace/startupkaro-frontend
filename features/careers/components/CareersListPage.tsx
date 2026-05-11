import { Suspense } from "react";
import { Heart, ShieldCheck, Users, Zap } from "lucide-react";
import { JobFilters } from "./ui/JobFilters";
import { JobsGroupedList } from "./ui/JobsGroupedList";
import type { JobCard } from "@/features/careers/types";

const CULTURE_PILLARS = [
    {
        icon: ShieldCheck,
        color: "#6BAE3A",
        title: "Compliance first",
        body: "We help founders stay compliant so we hold ourselves to the same standard, every process, every decision.",
    },
    {
        icon: Heart,
        color: "#FF9933",
        title: "Zero spam, full trust",
        body: "We never sell data, never cold-spam, never overwhelm. Every communication earns its place.",
    },
    {
        icon: Users,
        color: "#000080",
        title: "Expert, not corporate",
        body: "Real CAs, CSs, and legal experts, approachable, fast, and always in your corner.",
    },
    {
        icon: Zap,
        color: "#FF9933",
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
            <section className="relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/30 pointer-events-none" />
                <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#FF9933]/8 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#FF9933] mb-4">
                            Join our team
                        </p>
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-gray-900 leading-tight tracking-tight mb-6">
                            Build India&apos;s most{" "}
                            <span className="text-[#FF9933]">trusted</span>{" "}
                            compliance platform
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-2xl">
                            We&apos;re on a mission to become India&apos;s most trusted compliance partner for new-age founders, making GST, registrations, and legal paperwork completely headache-free. If you believe businesses should focus on building, not bureaucracy, you&apos;ll fit right in.
                        </p>
                        <div className="flex flex-wrap gap-5 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-[#6BAE3A]" />
                                Compliance-first culture
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Heart className="h-4 w-4 text-[#FF9933]" />
                                Strict no-spam policy
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-[#000080]" />
                                Expert team, founder mindset
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Culture pillars ─────────────────────────────────────────── */}
            <section className="bg-gray-50/60 py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <p className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-2">
                            How we work
                        </p>
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal">
                            Life at StartupKaro
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CULTURE_PILLARS.map(({ icon: Icon, color, title, body }) => (
                            <div
                                key={title}
                                className="group relative flex flex-col rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6"
                            >
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `${color}1A` }}
                                >
                                    <Icon className="h-5 w-5" style={{ color }} />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Job listings ────────────────────────────────────────────── */}
            <section className="bg-white py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 font-normal mb-2">
                            Open Positions
                        </h2>
                        <p className="text-sm text-gray-500">
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
