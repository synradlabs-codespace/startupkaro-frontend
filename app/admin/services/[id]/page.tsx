import { AdminServiceDetailPage } from "@/features/admin/components/AdminServiceDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminServiceDetailPage id={id} />;
}
