import { defineField, defineType } from "sanity";

export const embedInstagramType = defineType({
    name: "embedInstagram",
    title: "Instagram Reel",
    type: "object",
    fields: [
        defineField({
            name: "url",
            title: "Instagram Reel URL",
            type: "url",
            description: "Paste a public Instagram Reel URL (e.g. https://www.instagram.com/reel/...).",
            validation: (Rule) =>
                Rule.required().custom((val: string | undefined) => {
                    if (!val) return true;
                    if (/instagram\.com\/(reel|p)\//.test(val)) return true;
                    return "Must be an Instagram Reel or post URL";
                }),
        }),
    ],
    preview: {
        select: { title: "url" },
        prepare({ title }) {
            return { title: "Instagram Reel", subtitle: title };
        },
    },
});
