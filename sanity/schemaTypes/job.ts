import { defineField, defineType } from "sanity";
import { Briefcase } from "lucide-react";
import { JobIdInput } from "../components/JobIdInput";
import { SlugReadOnlyInput } from "../components/SlugReadOnlyInput";

const DEPARTMENT_OPTIONS = [
    { title: "Advisory", value: "Advisory" },
    { title: "Human Resources", value: "Human Resources" },
    { title: "Technical", value: "Technical" },
    { title: "Marketing", value: "Marketing" },
];

const WORK_TYPE_OPTIONS = [
    { title: "Full Time", value: "Full Time" },
    { title: "Internship", value: "Internship" },
];

export const jobType = defineType({
    name: "job",
    title: "Job Opening",
    type: "document",
    icon: Briefcase,
    groups: [
        { name: "overview", title: "Overview", default: true },
        { name: "content", title: "Content" },
        { name: "meta", title: "Meta" },
    ],
    fields: [
        defineField({
            name: "title",
            title: "Job Title",
            type: "string",
            group: "overview",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            group: "overview",
            description: "Auto-generated from Job ID. Do not edit manually.",
            options: { source: "jobId", maxLength: 96 },
            components: { input: SlugReadOnlyInput },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "jobId",
            title: "Job ID",
            type: "string",
            group: "overview",
            description: "Unique identifier shown on the application form. Auto-generated on creation — e.g. SK-874291",
            initialValue: () => `SK-${String(Date.now()).slice(-6)}`,
            components: { input: JobIdInput },
            validation: (Rule) =>
                Rule.required().custom((val: string | undefined) => {
                    if (!val) return true;
                    if (/^[A-Z]{2,4}-\d{3,6}$/.test(val)) return true;
                    return "Must match format SK-874291 (2–4 uppercase letters, hyphen, 3–6 digits)";
                }),
        }),
        defineField({
            name: "department",
            title: "Department",
            type: "string",
            group: "overview",
            options: { list: DEPARTMENT_OPTIONS, layout: "radio" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "workType",
            title: "Work Type",
            type: "string",
            group: "overview",
            options: { list: WORK_TYPE_OPTIONS, layout: "radio" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "location",
            title: "Location",
            type: "string",
            group: "overview",
            initialValue: "Mohali, Punjab, India",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "isRemote",
            title: "Remote",
            type: "boolean",
            group: "overview",
            description: "Toggle on if this role can be done remotely.",
            initialValue: false,
        }),
        defineField({
            name: "shortDescription",
            title: "Short Description",
            type: "text",
            group: "overview",
            rows: 3,
            description: "1–2 sentence summary shown on the listing card (max 220 chars).",
            validation: (Rule) => Rule.required().max(220),
        }),
        defineField({
            name: "bannerCtaLabel",
            title: "Banner CTA Label",
            type: "string",
            group: "overview",
            initialValue: "Apply Now",
        }),
        defineField({
            name: "whatYoullDo",
            title: "What You'll Do",
            type: "portableTextBody",
            group: "content",
            description: "Main responsibilities — rendered as rich text on the job detail page.",
        }),
        defineField({
            name: "requirements",
            title: "Requirements",
            type: "array",
            group: "content",
            of: [{ type: "string" }],
            description: "One requirement per item.",
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "bonusRequirements",
            title: "Bonus Requirements",
            type: "array",
            group: "content",
            of: [{ type: "string" }],
            description: "Nice-to-have skills. Optional.",
        }),
        defineField({
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
            group: "meta",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "isActive",
            title: "Active",
            type: "boolean",
            group: "meta",
            description: "Uncheck to hide this opening without deleting it.",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "department",
            isActive: "isActive",
        },
        prepare({ title, subtitle, isActive }) {
            return {
                title,
                subtitle: `${subtitle ?? "No dept"} · ${isActive ? "Active" : "Hidden"}`,
            };
        },
    },
    orderings: [
        {
            title: "Published At (newest)",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
});
