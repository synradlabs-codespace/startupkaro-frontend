// app/(marketing)/refund-policy/page.tsx

import type { Metadata } from "next";
import { RefundPolicyPage } from "@/features/marketing/components/RefundPolicyPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Refund Policy",
    description: "Startupkaro Private Limited's refund policy for company registration, compliance, and business service fees.",
    path: "/refund-policy",
});

export default function RefundPolicy() {
    return <RefundPolicyPage />;
}
