import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/features/articles/lib/portable-text-components";
import { JobBanner } from "./ui/JobBanner";
import { JobApplicationForm } from "./ui/JobApplicationForm";
import type { Job } from "@/features/careers/types";

interface JobDetailPageProps {
    job: Job;
}

export function JobDetailPage({ job }: JobDetailPageProps) {
    return (
        <main className="pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-1.5 text-sm text-graphite hover:text-ink transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    All open roles
                </Link>
            </div>
            <JobBanner job={job} />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

                {/* What you'll do */}
                {job.whatYoullDo && job.whatYoullDo.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold tracking-tight leading-snug text-ink mb-6">
                            What you&apos;ll do at StartupKaro
                        </h2>
                        <div className="space-y-5 text-sm text-slate leading-relaxed">
                            <PortableText
                                value={job.whatYoullDo}
                                components={portableTextComponents}
                            />
                        </div>
                    </section>
                )}

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold tracking-tight leading-snug text-ink mb-5">
                            Requirements
                        </h2>
                        <ul className="space-y-3">
                            {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-charcoal shrink-0" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Bonus requirements */}
                {job.bonusRequirements && job.bonusRequirements.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold tracking-tight leading-snug text-ink mb-5">
                            Bonus Requirements
                        </h2>
                        <ul className="space-y-3">
                            {job.bonusRequirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-stone shrink-0" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <div className="h-px bg-hairline" />

                {/* Application form */}
                <JobApplicationForm job={job} />
            </div>
        </main>
    );
}
