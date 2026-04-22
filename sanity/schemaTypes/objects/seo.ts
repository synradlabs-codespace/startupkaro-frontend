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
            description: "Overrides the page title in search results. Keep under 70 characters.",
            validation: (Rule) => Rule.max(70),
        }),
        defineField({
            name: "description",
            title: "SEO Description",
            type: "text",
            rows: 3,
            description: "Short summary shown in search results. Keep under 180 characters.",
            validation: (Rule) => Rule.max(180),
        }),
        defineField({
            name: "keywords",
            title: "Keywords",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
            description: "Keywords relevant to this article.",
        }),
        defineField({
            name: "ogImage",
            title: "OpenGraph Image",
            type: "image",
            description: "Image shown when the article is shared on social media (1200×630px recommended).",
            options: { hotspot: true },
            fields: [
                defineField({ name: "alt", type: "string", title: "Alt text" }),
            ],
        }),
    ],
});
