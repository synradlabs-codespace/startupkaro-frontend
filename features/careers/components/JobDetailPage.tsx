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
        <main>
            <JobBanner job={job} />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

                {/* What you'll do */}
                {job.whatYoullDo && job.whatYoullDo.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-normal tracking-tight leading-snug text-ink mb-6">
                            What you&apos;ll do at StartupKaro
                        </h2>
                        <div className="space-y-5 text-sm text-body-muted leading-relaxed">
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
                        <h2 className="font-display text-2xl font-normal tracking-tight leading-snug text-ink mb-5">
                            Requirements
                        </h2>
                        <ul className="space-y-3">
                            {job.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-body-muted">
                                    <span
                                        className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: "#ff7759" }}
                                    />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Bonus requirements */}
                {job.bonusRequirements && job.bonusRequirements.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-normal tracking-tight leading-snug text-ink mb-5">
                            Bonus Requirements
                        </h2>
                        <ul className="space-y-3">
                            {job.bonusRequirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-body-muted">
                                    <span
                                        className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: "#003c33" }}
                                    />
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
