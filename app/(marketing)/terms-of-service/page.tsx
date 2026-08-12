// app/(marketing)/terms-of-service/page.tsx

import type { Metadata } from "next";
import { TermsOfServicePage } from "@/features/marketing/components/TermsOfServicePage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Terms of Service",
    description: "The terms governing your access to and use of the Startupkaro Private Limited website and services.",
    path: "/terms-of-service",
});

export default function TermsOfService() {
    return <TermsOfServicePage />;
}
