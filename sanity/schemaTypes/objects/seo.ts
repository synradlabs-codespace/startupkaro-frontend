import { defineField, defineType } from "sanity";

export const seoType = defineType({
    name: "seo",
    title: "SEO",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "SEO Title",
            type: "string",
            description:
                "The headline Google shows in search results, and the text shown when this article is shared on WhatsApp or LinkedIn. Leave blank to reuse the article Title. Recommended: 50 to 60 characters. Anything past 60 usually gets cut off in Google.",
            validation: (Rule) => [
                Rule.max(70).error("SEO Title must be 70 characters or fewer."),
                Rule.custom((value?: string) =>
                    value && value.length > 60
                        ? "Longer than 60 characters. Google will likely truncate this in search results."
                        : true
                ).warning(),
            ],
        }),
        defineField({
            name: "description",
            title: "SEO Description",
            type: "text",
            rows: 3,
            description:
                "The grey summary text shown under the headline in Google results. Write it as a reason to click, not a summary of the article. Leave blank to reuse the article Summary. Recommended: 140 to 160 characters.",
            validation: (Rule) => [
                Rule.max(180).error("SEO Description must be 180 characters or fewer."),
                Rule.custom((value?: string) =>
                    value && value.length > 160
                        ? "Longer than 160 characters. Google will likely truncate this in search results."
                        : true
                ).warning(),
            ],
        }),
        defineField({
            name: "keywords",
            title: "Keywords",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
            description:
                "Topic tags for this article, e.g. \"GST return filing\", \"private limited company\". These do not affect Google rankings. They are used internally only. 3 to 6 is plenty.",
            validation: (Rule) =>
                Rule.custom((value?: string[]) =>
                    value && value.length > 10 ? "More than 10 keywords is rarely useful. Keep it focused." : true
                ).warning(),
        }),
        defineField({
            name: "ogImage",
            title: "OpenGraph Image",
            type: "image",
            description:
                "The preview picture shown when this article's link is pasted into WhatsApp, LinkedIn, or X. Leave blank and StartupKaro automatically generates a clean branded card with the article title on it. If you upload your own, use 1200 × 630px.",
            options: { hotspot: true },
            fields: [
                defineField({
                    name: "alt",
                    type: "string",
                    title: "Alt text",
                    description: "Describe the image in a few words, for screen readers.",
                }),
            ],
        }),
        defineField({
            name: "canonicalUrl",
            title: "Canonical URL",
            type: "url",
            description:
                "Only set this if this article was first published somewhere else. Paste the original URL so Google credits that page instead of this one. Leave blank otherwise, most articles never need this.",
            validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
        }),
        defineField({
            name: "noIndex",
            title: "Hide from Google",
            type: "boolean",
            initialValue: false,
            description:
                "Turn on to keep this article live on the site but hidden from Google search results. Use for drafts, seasonal pages, or anything you don't want indexed yet.",
        }),
    ],
});
