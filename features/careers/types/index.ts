import type { PortableTextBlock } from "@portabletext/types";

export type Department = "Advisory" | "Human Resources" | "Technical" | "Marketing";
export type WorkType = "Full Time" | "Internship";

export interface JobCard {
    _id: string;
    title: string;
    slug: string;
    jobId: string;
    department: Department;
    workType: WorkType;
    location: string;
    isRemote: boolean;
    shortDescription: string;
}

export interface Job extends JobCard {
    bannerCtaLabel: string;
    publishedAt: string;
    whatYoullDo: PortableTextBlock[];
    requirements: string[];
    bonusRequirements?: string[];
}
