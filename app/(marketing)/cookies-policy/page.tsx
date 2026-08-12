// app/(marketing)/cookies-policy/page.tsx

import type { Metadata } from "next";
import { CookiesPolicyPage } from "@/features/marketing/components/CookiesPolicyPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Cookies & Data Collection",
    description: "How Startupkaro Private Limited uses cookies and other data-collection technologies on startupkaro.in.",
    path: "/cookies-policy",
});

export default function CookiesPolicy() {
    return <CookiesPolicyPage />;
}
