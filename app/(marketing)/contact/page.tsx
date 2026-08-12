// app/(marketing)/contact/page.tsx

import type { Metadata } from "next";
import { ContactPage } from "@/features/marketing/components/ContactPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Contact Us",
    description:
        "Have a question about our services or need help choosing the right compliance package? Our experts in Mohali, Punjab are here to help.",
    path: "/contact",
});

export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
    const { service } = await searchParams;
    return <ContactPage initialServiceSlug={service} />;
}
