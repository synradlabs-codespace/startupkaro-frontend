import { defineField, defineType } from "sanity";
import { UserIcon } from "lucide-react";

export const authorType = defineType({
    name: "author",
    title: "Author",
    type: "document",
    icon: UserIcon,
    fields: [
        defineField({
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "designation",
            title: "Designation / Role",
            type: "string",
            description: "e.g. Chartered Accountant, Legal Expert, Founder",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name", maxLength: 64 },
        }),
        defineField({
            name: "avatar",
            title: "Profile Photo",
            type: "image",
            options: { hotspot: true },
            fields: [
                defineField({ name: "alt", type: "string", title: "Alt text" }),
            ],
        }),
        defineField({
            name: "bio",
            title: "Bio",
            type: "text",
            rows: 4,
            description: "Short author bio shown at the bottom of articles.",
        }),
    ],
    preview: {
        select: { title: "name", subtitle: "designation", media: "avatar" },
    },
});
