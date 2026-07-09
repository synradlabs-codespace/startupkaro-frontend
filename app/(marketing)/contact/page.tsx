// app/(marketing)/contact/page.tsx

import { ContactPage } from "@/features/marketing/components/ContactPage";

export default async function Contact({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
    const { service } = await searchParams;
    return <ContactPage initialServiceSlug={service} />;
}
