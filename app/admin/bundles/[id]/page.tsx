import { AdminBundleForm } from "@/features/admin/components/AdminBundleForm";

export default async function BundleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminBundleForm id={id} />;
}
