import Link from "next/link";
import { MapPin, Briefcase, Wifi, ArrowRight } from "lucide-react";
import type { JobCard as JobCardType } from "@/features/careers/types";

interface JobCardProps {
    job: JobCardType;
    index: number;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <div className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-hairline bg-canvas transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-brand sm:flex-row">
            <Link
                href={`/careers/${job.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`View full details for ${job.title}`}
            />

            <div className="flex flex-1 flex-col sm:flex-row gap-4 p-5">
                {/* Left — title + description */}
                <div className="flex-1 min-w-0">
                    <h3 className="mb-1.5 text-base font-medium leading-snug text-ink">
                        {job.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-charcoal">
                        {job.shortDescription}
                    </p>
                </div>

                <div className="h-px sm:h-auto sm:w-px bg-hairline sm:self-stretch shrink-0" />

                {/* Right — meta + CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:min-w-40">
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-cloud px-2.5 py-1 text-xs text-charcoal">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-cloud px-2.5 py-1 text-xs text-charcoal">
                            <Briefcase className="h-3 w-3 shrink-0" />
                            {job.workType}
                        </span>
                        {job.isRemote && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2.5 py-1 text-xs font-medium text-ink">
                                <Wifi className="h-3 w-3 shrink-0" />
                                Remote
                            </span>
                        )}
                    </div>
                    <div
                        className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-hairline bg-canvas text-graphite transition-all duration-200 group-hover:border-primary-brand group-hover:bg-primary-brand group-hover:text-white"
                        aria-hidden="true"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
