import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "refunded" | "partial";
type InquiryStatus = "unresolved" | "resolved";

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: "bg-tint-cream text-charcoal border-hairline hover:bg-tint-cream" },
  processing: { label: "Processing", className: "bg-tint-sky text-charcoal border-hairline hover:bg-tint-sky" },
  completed:  { label: "Completed",  className: "bg-tint-mint text-charcoal border-hairline hover:bg-tint-mint" },
  cancelled:  { label: "Cancelled",  className: "bg-red-50 text-error-brand border-red-100 hover:bg-red-50" },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  paid:     { label: "Paid",     className: "bg-tint-mint text-charcoal border-hairline hover:bg-tint-mint" },
  unpaid:   { label: "Unpaid",   className: "bg-red-50 text-error-brand border-red-100 hover:bg-red-50" },
  refunded: { label: "Refunded", className: "bg-tint-lavender text-charcoal border-hairline hover:bg-tint-lavender" },
  partial:  { label: "Partial",  className: "bg-tint-peach text-charcoal border-hairline hover:bg-tint-peach" },
};

const inquiryStatusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  unresolved: { label: "Unresolved", className: "bg-tint-peach text-charcoal border-hairline hover:bg-tint-peach" },
  resolved:   { label: "Resolved",   className: "bg-tint-mint text-charcoal border-hairline hover:bg-tint-mint" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = orderStatusConfig[status as OrderStatus] ?? orderStatusConfig.pending;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const config = paymentStatusConfig[status as PaymentStatus] ?? paymentStatusConfig.unpaid;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function InquiryStatusBadge({ status }: { status: string }) {
  const config = inquiryStatusConfig[status as InquiryStatus] ?? inquiryStatusConfig.unresolved;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
