import { MapPin, Briefcase, Wifi } from "lucide-react";
import type { Job } from "@/features/careers/types";

interface JobBannerProps {
    job: Job;
}

export function JobBanner({ job }: JobBannerProps) {
    return (
        <div className="w-full bg-[#FF9933]/8 border-b border-[#FF9933]/15 py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#FF9933] mb-3">
                    {job.department} · {job.workType}
                </p>
                <h1 className="font-serif text-3xl md:text-5xl text-[#000080] font-normal leading-tight max-w-3xl">
                    {job.title}
                </h1>

                <div className="flex flex-wrap gap-3 mt-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 shadow-sm">
                        <MapPin className="h-3.5 w-3.5 text-[#FF9933]" />
                        {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600 shadow-sm">
                        <Briefcase className="h-3.5 w-3.5 text-[#000080]" />
                        {job.workType}
                    </span>
                    {job.isRemote && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6BAE3A]/10 border border-[#6BAE3A]/20 text-xs text-[#6BAE3A] font-medium shadow-sm">
                            <Wifi className="h-3.5 w-3.5" />
                            Remote
                        </span>
                    )}
                </div>

                <div className="mt-8">
                    <a
                        href="#apply"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF9933] hover:bg-[#FF9933]/90 text-white text-sm font-mono uppercase tracking-widest shadow-sm shadow-[#FF9933]/20 transition-all duration-200"
                    >
                        {job.bannerCtaLabel ?? "Apply Now"}
                    </a>
                </div>
            </div>
        </div>
    );
}
