import { MapPin, Briefcase, Wifi } from "lucide-react";
import type { Job } from "@/features/careers/types";

interface JobBannerProps {
    job: Job;
}

export function JobBanner({ job }: JobBannerProps) {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-tint-sky rounded-2xl px-8 py-14 md:py-20">
                <p className="text-xs font-medium uppercase tracking-[0.28px] text-steel mb-3">
                    {job.department} · {job.workType}
                </p>
                <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-none text-ink max-w-3xl mb-6">
                    {job.title}
                </h1>

                <div className="flex flex-wrap gap-3 mb-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-canvas border border-hairline text-xs text-slate">
                        <MapPin className="h-3.5 w-3.5 text-stone" />
                        {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-canvas border border-hairline text-xs text-slate">
                        <Briefcase className="h-3.5 w-3.5 text-stone" />
                        {job.workType}
                    </span>
                    {job.isRemote && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-tint-mint border border-hairline text-xs text-charcoal font-medium">
                            <Wifi className="h-3.5 w-3.5" />
                            Remote
                        </span>
                    )}
                </div>

                <a
                    href="#apply"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary-brand hover:opacity-90 text-white text-sm font-medium transition-opacity duration-200"
                >
                    {job.bannerCtaLabel ?? "Apply Now"}
                </a>
            </div>
        </div>
    );
}
