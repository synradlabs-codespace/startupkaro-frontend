"use client";

import { useSearchParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import { JobCard } from "./JobCard";
import type { JobCard as JobCardType, Department } from "@/features/careers/types";

const DEPARTMENT_ORDER: Department[] = ["Advisory", "Human Resources", "Technical", "Marketing"];

interface JobsGroupedListProps {
    jobs: JobCardType[];
}

export function JobsGroupedList({ jobs }: JobsGroupedListProps) {
    const params = useSearchParams();

    const departmentFilter = params.get("department") ?? "";
    const workTypeFilter = params.get("workType") ?? "";
    const locationFilter = params.get("location") ?? "";
    const remoteOnly = params.get("remoteOnly") === "true";

    const filtered = jobs.filter((j) => {
        if (departmentFilter && j.department !== departmentFilter) return false;
        if (workTypeFilter && j.workType !== workTypeFilter) return false;
        if (locationFilter && j.location !== locationFilter) return false;
        if (remoteOnly && !j.isRemote) return false;
        return true;
    });

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">No openings found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or check back soon.</p>
            </div>
        );
    }

    // Group by department preserving canonical order
    const groups = DEPARTMENT_ORDER.reduce<Record<string, JobCardType[]>>((acc, dept) => {
        const items = filtered.filter((j) => j.department === dept);
        if (items.length > 0) acc[dept] = items;
        return acc;
    }, {});

    // Also capture jobs from departments not in canonical order (future-proof)
    filtered.forEach((j) => {
        if (!(j.department in groups)) {
            groups[j.department] = groups[j.department] ?? [];
            groups[j.department].push(j);
        }
    });

    let globalIndex = 0;

    return (
        <div className="space-y-12">
            {Object.entries(groups).map(([dept, items]) => (
                <section key={dept}>
                    <h2 className="font-serif text-2xl text-gray-900 font-normal mb-6">{dept}</h2>
                    <div className="space-y-3">
                        {items.map((job) => (
                            <JobCard key={job._id} job={job} index={globalIndex++} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
