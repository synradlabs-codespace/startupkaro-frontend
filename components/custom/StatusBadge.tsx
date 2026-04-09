import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "refunded" | "partial";
type InquiryStatus = "unresolved" | "resolved";

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" },
  completed:  { label: "Completed",  className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  paid:     { label: "Paid",     className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  unpaid:   { label: "Unpaid",   className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
  refunded: { label: "Refunded", className: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100" },
  partial:  { label: "Partial",  className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100" },
};

const inquiryStatusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  unresolved: { label: "Unresolved", className: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100" },
  resolved:   { label: "Resolved",   className: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = orderStatusConfig[status] ?? orderStatusConfig.pending;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentStatusConfig[status] ?? paymentStatusConfig.unpaid;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const config = inquiryStatusConfig[status] ?? inquiryStatusConfig.unresolved;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
