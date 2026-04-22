import { defineArrayMember, defineType } from "sanity";

export const portableTextBodyType = defineType({
    name: "portableTextBody",
    title: "Article Body",
    type: "array",
    of: [
        // Rich text block (paragraphs, headings, quotes, lists)
        defineArrayMember({
            type: "block",
            styles: [
                { title: "Normal", value: "normal" },
                { title: "Heading 2", value: "h2" },
                { title: "Heading 3", value: "h3" },
                { title: "Quote", value: "blockquote" },
            ],
            lists: [
                { title: "Bullet list", value: "bullet" },
                { title: "Numbered list", value: "number" },
            ],
            marks: {
                decorators: [
                    { title: "Bold", value: "strong" },
                    { title: "Italic", value: "em" },
                    { title: "Code", value: "code" },
                ],
                annotations: [
                    {
                        name: "link",
                        type: "object",
                        title: "Link",
                        fields: [
                            {
                                name: "href",
                                type: "url",
                                title: "URL",
                                validation: (Rule) =>
                                    Rule.uri({ scheme: ["http", "https", "mailto"] }),
                            },
                            {
                                name: "blank",
                                type: "boolean",
                                title: "Open in new tab",
                                initialValue: false,
                            },
                        ],
                    },
                ],
            },
        }),
        // Inline image block
        defineArrayMember({
            type: "image",
            name: "image",
            title: "Image",
            options: { hotspot: true },
            fields: [
                {
                    name: "alt",
                    type: "string",
                    title: "Alt text",
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "caption",
                    type: "string",
                    title: "Caption (optional)",
                },
            ],
            preview: {
                select: { media: "asset", subtitle: "alt" },
                prepare({ media, subtitle }) {
                    return { title: "Image", subtitle, media };
                },
            },
        }),
        // Custom quote block (distinct from blockquote style — for styled pull-quotes with citation)
        defineArrayMember({
            type: "object",
            name: "quote",
            title: "Pull Quote",
            fields: [
                {
                    name: "text",
                    type: "text",
                    title: "Quote text",
                    rows: 3,
                    validation: (Rule) => Rule.required(),
                },
                {
                    name: "cite",
                    type: "string",
                    title: "Attribution (optional)",
                },
            ],
            preview: {
                select: { title: "text", subtitle: "cite" },
                prepare({ title, subtitle }) {
                    return {
                        title: `"${String(title).slice(0, 60)}${String(title).length > 60 ? "…" : ""}"`,
                        subtitle: subtitle ? `— ${subtitle}` : undefined,
                    };
                },
            },
        }),
        // Instagram Reel embed
        defineArrayMember({ type: "embedInstagram" }),
        // YouTube video embed
        defineArrayMember({ type: "embedYouTube" }),
    ],
});
