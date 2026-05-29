// app/api/sanity/service-slugs/route.ts
// Returns slugs of all active Sanity service documents.
// Consumed by the admin panel to show which backend services have CMS content.
// Uses plain client.fetch (no draftMode) and tags the response so the revalidate
// webhook keeps it fresh when service docs are published/unpublished.

import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { ALL_SERVICE_SLUGS_QUERY } from "@/sanity/queries";

export async function GET() {
    try {
        const data = await client.fetch(
            ALL_SERVICE_SLUGS_QUERY,
            {},
            { next: { tags: ["service"] } },
        );
        const slugs = ((data ?? []) as { slug: string }[]).map((s) => s.slug);
        return NextResponse.json({ slugs });
    } catch {
        return NextResponse.json({ slugs: [] });
    }
}
