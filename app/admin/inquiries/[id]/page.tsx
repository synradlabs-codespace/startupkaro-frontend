// app/admin/inquiries/[id]/page.tsx

import { AdminInquiryDetailPage } from "@/features/admin/components/AdminInquiryDetailPage";

export default function InquiryDetailPage({ params }: { params: { id: string } }) {
    return <AdminInquiryDetailPage id={params.id} />;
}