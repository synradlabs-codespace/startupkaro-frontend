import { defineField, defineType } from "sanity";
import { LayoutGrid } from "lucide-react";

const ICON_OPTIONS = [
    { title: "File / Tax", value: "FileText" },
    { title: "Scale / Legal", value: "Scale" },
    { title: "Shield / Compliance", value: "ShieldCheck" },
    { title: "Rocket / Startup", value: "Rocket" },
    { title: "Trending Up / Finance", value: "TrendingUp" },
    { title: "Building / Business", value: "Building2" },
    { title: "Briefcase", value: "Briefcase" },
    { title: "Globe", value: "Globe" },
    { title: "Lightbulb", value: "Lightbulb" },
    { title: "Grid (default)", value: "LayoutGrid" },
];

export const categoryType = defineType({
    name: "category",
    title: "Category",
    type: "document",
    icon: LayoutGrid,
    fields: [
        defineField({
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title", maxLength: 64 },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
            rows: 2,
        }),
        defineField({
            name: "iconName",
            title: "Icon",
            type: "string",
            options: { list: ICON_OPTIONS, layout: "radio" },
            description: "Icon shown in the category filter chip and article badges.",
            initialValue: "LayoutGrid",
        }),
        defineField({
            name: "accentColor",
            title: "Accent Color",
            type: "string",
            description: "Hex color code (e.g. #FF9933). Used for category badges.",
            initialValue: "#6B7280",
            validation: (Rule) =>
                Rule.custom((val: string | undefined) => {
                    if (!val) return true;
                    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) return true;
                    return "Must be a valid hex color (e.g. #FF9933)";
                }),
        }),
    ],
    preview: {
        select: { title: "title", subtitle: "slug.current" },
        prepare({ title, subtitle }) {
            return { title, subtitle: `/${subtitle}` };
        },
    },
});
