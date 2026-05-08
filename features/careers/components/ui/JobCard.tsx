import Link from "next/link";
import { MapPin, Briefcase, Wifi, ArrowRight } from "lucide-react";
import type { JobCard as JobCardType } from "@/features/careers/types";

const ACCENT_COLORS = ["#FF9933", "#000080", "#6BAE3A"];

interface JobCardProps {
    job: JobCardType;
    index: number;
}

export function JobCard({ job, index }: JobCardProps) {
    const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

    return (
        <div className="group relative flex flex-col sm:flex-row rounded-2xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer">
            {/* Stretched link covers the entire card */}
            <Link
                href={`/careers/${job.slug}`}
                className="absolute inset-0 z-0"
                aria-label={`View full details for ${job.title}`}
            />

            {/* Accent top strip */}
            <div className="h-1 sm:h-auto sm:w-1 shrink-0" style={{ backgroundColor: accent }} />

            <div className="flex flex-1 flex-col sm:flex-row gap-4 p-5">
                {/* Left — title + description */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#000080] transition-colors leading-snug">
                        {job.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {job.shortDescription}
                    </p>
                </div>

                {/* Divider on mobile / vertical on desktop */}
                <div className="h-px sm:h-auto sm:w-px bg-gray-100 sm:self-stretch shrink-0" />

                {/* Right — meta + CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:min-w-40">
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs text-gray-600">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-xs text-gray-600">
                            <Briefcase className="h-3 w-3 shrink-0" />
                            {job.workType}
                        </span>
                        {job.isRemote && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6BAE3A]/10 text-xs text-[#6BAE3A] font-medium">
                                <Wifi className="h-3 w-3 shrink-0" />
                                Remote
                            </span>
                        )}
                    </div>
                    <div
                        className="relative z-10 inline-flex items-center justify-center h-9 w-9 rounded-xl border border-gray-200 bg-white text-gray-500 group-hover:bg-[#FF9933] group-hover:border-[#FF9933] group-hover:text-white transition-all duration-200 shrink-0"
                        aria-hidden="true"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
