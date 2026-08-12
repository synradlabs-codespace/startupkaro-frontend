// app/robots.ts

import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/employee", "/customer", "/studio", "/api"],
        },
        sitemap: absoluteUrl("/sitemap.xml"),
        host: SITE_URL,
    };
}
