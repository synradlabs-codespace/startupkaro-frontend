import { defineField, defineType } from "sanity";

export const embedYouTubeType = defineType({
    name: "embedYouTube",
    title: "YouTube Video",
    type: "object",
    fields: [
        defineField({
            name: "url",
            title: "YouTube URL",
            type: "url",
            description: "Paste a YouTube video URL (e.g. https://www.youtube.com/watch?v=...).",
            validation: (Rule) =>
                Rule.required().custom((val: string | undefined) => {
                    if (!val) return true;
                    if (/youtube\.com|youtu\.be/.test(val)) return true;
                    return "Must be a YouTube URL (youtube.com or youtu.be)";
                }),
        }),
        defineField({
            name: "title",
            title: "Caption (optional)",
            type: "string",
            description: "Shown below the embedded video.",
        }),
    ],
    preview: {
        select: { title: "url", subtitle: "title" },
        prepare({ title, subtitle }) {
            return { title: subtitle || "YouTube Video", subtitle: title };
        },
    },
});
