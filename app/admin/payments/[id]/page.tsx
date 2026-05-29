import { AdminPaymentDetailPage } from "@/features/admin/components/AdminPaymentsDetailPage";


export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminPaymentDetailPage id={id} />;
}