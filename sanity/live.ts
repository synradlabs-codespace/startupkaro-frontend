import { defineLive } from "next-sanity/live";
import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
    client,
    serverToken: process.env.SANITY_API_TOKEN,
    browserToken: false,
    // In production defineLive otherwise caches forever and only the webhook / a connected
    // browser can invalidate it. A 60s window guarantees new content appears within a minute.
    fetchOptions: { revalidate: 60 },
});
