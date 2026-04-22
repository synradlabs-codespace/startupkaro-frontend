import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
    basePath: "/studio",
    projectId,
    dataset,
    schema: {
        types: schemaTypes,
    },
    plugins: [
        structureTool(),
        visionTool({ defaultApiVersion: apiVersion }),
    ],
    document: {
        productionUrl: async (prev, { document: doc }) => {
            const previewSecret = process.env.SANITY_PREVIEW_SECRET;
            if (!previewSecret) return prev;
            if (doc._type !== "article") return prev;
            const slug = (doc as { slug?: { current?: string } }).slug?.current;
            if (!slug) return prev;
            const baseUrl =
                typeof window !== "undefined"
                    ? window.location.origin
                    : "http://localhost:3000";
            return `${baseUrl}/api/draft-mode/enable?secret=${previewSecret}&slug=${slug}`;
        },
    },
});
