"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Department, WorkType } from "@/features/careers/types";

const DEPARTMENTS: Department[] = ["Advisory", "Human Resources", "Technical", "Marketing"];
const WORK_TYPES: WorkType[] = ["Full Time", "Internship"];

interface JobFiltersProps {
    locations: string[];
}

export function JobFilters({ locations }: JobFiltersProps) {
    const router = useRouter();
    const params = useSearchParams();

    const department = params.get("department") ?? "";
    const workType = params.get("workType") ?? "";
    const location = params.get("location") ?? "";
    const remoteOnly = params.get("remoteOnly") === "true";

    const update = useCallback(
        (key: string, value: string | boolean) => {
            const next = new URLSearchParams(params.toString());
            if (value === "" || value === false) {
                next.delete(key);
            } else {
                next.set(key, String(value));
            }
            router.push(`/careers?${next.toString()}`, { scroll: false });
        },
        [router, params],
    );

    const hasFilters = department || workType || location || remoteOnly;

    return (
        <div className="flex flex-wrap items-end gap-3">
            {/* Department */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                    Department
                </label>
                <Select value={department} onValueChange={(v) => update("department", !v || v === "all" ? "" : v)}>
                    <SelectTrigger className="w-44 h-10 rounded-xl bg-white border-gray-200 text-sm">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {DEPARTMENTS.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Work Type */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                    Work Type
                </label>
                <Select value={workType} onValueChange={(v) => update("workType", !v || v === "all" ? "" : v)}>
                    <SelectTrigger className="w-40 h-10 rounded-xl bg-white border-gray-200 text-sm">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {WORK_TYPES.map((w) => (
                            <SelectItem key={w} value={w}>{w}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-gray-400">
                    Location
                </label>
                <Select value={location} onValueChange={(v) => update("location", !v || v === "all" ? "" : v)}>
                    <SelectTrigger className="w-48 h-10 rounded-xl bg-white border-gray-200 text-sm">
                        <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((l) => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Remote only */}
            <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-gray-200 bg-white">
                <Switch
                    id="remote-only"
                    checked={remoteOnly}
                    onCheckedChange={(v) => update("remoteOnly", v)}
                    className="data-[state=checked]:bg-[#ff7759]"
                />
                <Label htmlFor="remote-only" className="text-sm text-gray-600 cursor-pointer select-none">
                    Remote only
                </Label>
            </div>

            {/* Clear */}
            {hasFilters && (
                <button
                    onClick={() => router.push("/careers", { scroll: false })}
                    className="h-10 px-3 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
