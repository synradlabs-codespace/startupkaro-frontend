// app/(marketing)/privacy-policy/page.tsx

import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/features/marketing/components/PrivacyPolicyPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Privacy Policy",
    description: "How Startupkaro Private Limited collects, uses, and protects your information across startupkaro.in and our business services.",
    path: "/privacy-policy",
});

export default function PrivacyPolicy() {
    return <PrivacyPolicyPage />;
}
