import { AdminPaymentDetailPage } from "@/features/admin/components/AdminPaymentsDetailPage";


export default function PaymentDetailPage({ params }: { params: { id: string } }) {
  return <AdminPaymentDetailPage id={params.id} />;
}