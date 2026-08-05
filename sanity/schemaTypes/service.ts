import { defineField, defineType } from "sanity";
import { LayoutGrid } from "lucide-react";

const CATEGORY_OPTIONS = [
    { title: "Start", value: "Start" },
    { title: "Manage", value: "Manage" },
    { title: "Protect", value: "Protect" },
];

export const serviceType = defineType({
    name: "service",
    title: "Service",
    type: "document",
    icon: LayoutGrid,
    groups: [
        { name: "overview", title: "Overview", default: true },
        { name: "content", title: "Content" },
        { name: "meta", title: "Meta" },
    ],
    fields: [
        defineField({
            name: "name",
            title: "Service Name",
            type: "string",
            group: "overview",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            group: "overview",
            description:
                "MUST exactly match the backend service slug (e.g. llp). This is the join key. A mismatch means no price or checkout CTA on the site.",
            options: { source: "name", maxLength: 96 },
            validation: (Rule) =>
                Rule.required().custom((val: { current?: string } | undefined) => {
                    if (!val?.current) return true;
                    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val.current)) return true;
                    return "Must be lowercase kebab-case only (e.g. llp). No spaces, uppercase, or special characters.";
                }),
        }),
        defineField({
            name: "category",
            title: "Stage",
            type: "string",
            group: "overview",
            options: { list: CATEGORY_OPTIONS, layout: "radio" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "stage",
            title: "Stage (explicit)",
            type: "string",
            group: "overview",
            description: "Optional explicit stage. If empty, the Stage field above is used.",
            options: { list: CATEGORY_OPTIONS, layout: "radio" },
        }),
        defineField({
            name: "isBundle",
            title: "Bundle",
            type: "boolean",
            group: "overview",
            initialValue: false,
            description: "Enable for services that represent a bundled package.",
        }),
        defineField({
            name: "duration",
            title: "Estimated Duration",
            type: "string",
            group: "overview",
            description: "e.g. 7-10 working days",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "tagline",
            title: "Tagline",
            type: "string",
            group: "overview",
            description: "One-line subtitle shown in the hero and on cards (max 160 chars).",
            validation: (Rule) => Rule.required().max(160),
        }),
        defineField({
            name: "heroImage",
            title: "Hero Image",
            type: "image",
            group: "overview",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    title: "Alt Text",
                    type: "string",
                    validation: (Rule) => Rule.required(),
                }),
            ],
        }),
        defineField({
            name: "shortDescription",
            title: "Short Description",
            type: "text",
            group: "overview",
            rows: 3,
            description: "1-2 sentence summary shown on listing cards (max 220 chars).",
            validation: (Rule) => Rule.required().max(220),
        }),
        defineField({
            name: "overview",
            title: "Overview",
            type: "portableTextBody",
            group: "content",
            description: "Full rich-text description rendered on the service detail page.",
        }),
        defineField({
            name: "whatsIncluded",
            title: "What's Included",
            type: "array",
            group: "content",
            of: [{ type: "string" }],
            description: "One deliverable per item.",
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "bundleInclusions",
            title: "Bundle Inclusions",
            type: "array",
            group: "content",
            of: [{ type: "string" }],
            description: "Services included in a bundle. Used as an editorial fallback when backend bundle items are unavailable.",
        }),
        defineField({
            name: "process",
            title: "Process Steps",
            type: "array",
            group: "content",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({ name: "title", title: "Step Title", type: "string", validation: (Rule) => Rule.required() }),
                        defineField({ name: "description", title: "Description", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
                    ],
                    preview: {
                        select: { title: "title" },
                        prepare({ title }) {
                            return { title };
                        },
                    },
                },
            ],
            description: "Step number is derived from position. Reorder to change sequence.",
        }),
        defineField({
            name: "faqs",
            title: "FAQs",
            type: "array",
            group: "content",
            of: [
                {
                    type: "object",
                    fields: [
                        defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
                        defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
                    ],
                    preview: {
                        select: { title: "question" },
                        prepare({ title }) {
                            return { title };
                        },
                    },
                },
            ],
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
            description: "Uncheck to hide this service without deleting it.",
            initialValue: true,
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "category",
            isActive: "isActive",
        },
        prepare({ title, subtitle, isActive }) {
            return {
                title,
                subtitle: `${subtitle ?? "No category"} · ${isActive ? "Active" : "Hidden"}`,
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
