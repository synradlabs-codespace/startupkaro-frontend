// app/admin/inquiries/[id]/page.tsx

import { AdminInquiryDetailPage } from "@/features/admin/components/AdminInquiryDetailPage";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminInquiryDetailPage id={id} />;
}