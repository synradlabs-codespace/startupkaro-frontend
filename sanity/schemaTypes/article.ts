import { defineField, defineType } from "sanity";
import { BookOpenIcon } from "lucide-react";

export const articleType = defineType({
    name: "article",
    title: "Article",
    type: "document",
    icon: BookOpenIcon,
    groups: [
        { name: "content", title: "Content", default: true },
        { name: "meta", title: "Meta" },
        { name: "seo", title: "SEO" },
    ],
    fields: [
        // ── Content group ──────────────────────────────────────────
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            group: "content",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            group: "content",
            options: { source: "title", maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "summary",
            title: "Summary",
            type: "text",
            rows: 3,
            group: "content",
            description: "Short description shown on article cards and in search results (max 220 chars).",
            validation: (Rule) => Rule.required().max(220),
        }),
        defineField({
            name: "coverImage",
            title: "Cover Image",
            type: "image",
            group: "content",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    type: "string",
                    title: "Alt text",
                    validation: (Rule) => Rule.required(),
                }),
            ],
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "body",
            title: "Body",
            type: "portableTextBody",
            group: "content",
        }),

        // ── Meta group ─────────────────────────────────────────────
        defineField({
            name: "author",
            title: "Author",
            type: "reference",
            to: [{ type: "author" }],
            group: "meta",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "categories",
            title: "Categories",
            type: "array",
            of: [{ type: "reference", to: [{ type: "category" }] }],
            group: "meta",
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: "publishedAt",
            title: "Published Date",
            type: "datetime",
            group: "meta",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "updatedAt",
            title: "Last Updated Date",
            type: "datetime",
            group: "meta",
        }),
        defineField({
            name: "readTime",
            title: "Read Time (minutes)",
            type: "number",
            group: "meta",
            description: "Optional. If blank, the frontend will auto-calculate from content length.",
            validation: (Rule) => Rule.min(1).integer(),
        }),
        defineField({
            name: "relatedArticles",
            title: "Related Articles",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "article" }],
                    options: {
                        filter: 'defined(publishedAt) && _id != ^._id',
                    },
                },
            ],
            group: "meta",
            description: "Pick up to 3 related articles. Remaining slots are auto-filled by shared category.",
            validation: (Rule) =>
                Rule.max(3).custom((refs: { _ref: string }[] | undefined) => {
                    if (!refs) return true;
                    const ids = refs.map((r) => r._ref);
                    const unique = new Set(ids);
                    if (unique.size !== ids.length) return "Duplicate articles are not allowed";
                    return true;
                }),
        }),

        // ── SEO group ──────────────────────────────────────────────
        defineField({
            name: "seo",
            title: "SEO",
            type: "seo",
            group: "seo",
        }),
    ],
    preview: {
        select: {
            title: "title",
            subtitle: "publishedAt",
            media: "coverImage",
        },
        prepare({ title, subtitle, media }) {
            return {
                title,
                subtitle: subtitle
                    ? new Date(subtitle).toLocaleDateString("en-IN", { dateStyle: "medium" })
                    : "Unpublished",
                media,
            };
        },
    },
    orderings: [
        {
            title: "Published Date (newest first)",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
});
