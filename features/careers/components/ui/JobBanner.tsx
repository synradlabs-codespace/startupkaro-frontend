import { MapPin, Briefcase, Wifi } from "lucide-react";
import type { Job } from "@/features/careers/types";

interface JobBannerProps {
    job: Job;
}

export function JobBanner({ job }: JobBannerProps) {
    return (
        <div className="w-full bg-white border-b border-hairline py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="font-mono text-xs uppercase tracking-[0.28px] text-coral mb-3">
                    {job.department} · {job.workType}
                </p>
                <h1 className="font-display text-3xl md:text-5xl font-normal tracking-tight leading-none text-ink max-w-3xl">
                    {job.title}
                </h1>

                <div className="flex flex-wrap gap-3 mt-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-hairline text-xs text-body-muted">
                        <MapPin className="h-3.5 w-3.5 text-coral" />
                        {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-hairline text-xs text-body-muted">
                        <Briefcase className="h-3.5 w-3.5 text-ink" />
                        {job.workType}
                    </span>
                    {job.isRemote && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pale-green border border-hairline text-xs text-deep-green font-medium">
                            <Wifi className="h-3.5 w-3.5" />
                            Remote
                        </span>
                    )}
                </div>

                <div className="mt-8">
                    <a
                        href="#apply"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark-navy hover:opacity-90 text-white text-sm font-medium transition-opacity duration-200"
                    >
                        {job.bannerCtaLabel ?? "Apply Now"}
                    </a>
                </div>
            </div>
        </div>
    );
}
