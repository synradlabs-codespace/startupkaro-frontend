import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
type PaymentStatus = "paid" | "unpaid" | "refunded" | "partial";
type InquiryStatus = "unresolved" | "resolved";

const positive = "bg-status-positive-bg text-status-positive-fg border-status-positive-border hover:bg-status-positive-bg";
const warning  = "bg-status-warning-bg text-status-warning-fg border-status-warning-border hover:bg-status-warning-bg";
const info     = "bg-status-info-bg text-status-info-fg border-status-info-border hover:bg-status-info-bg";
const neutral  = "bg-status-neutral-bg text-status-neutral-fg border-status-neutral-border hover:bg-status-neutral-bg";
const danger   = "bg-status-danger-bg text-status-danger-fg border-status-danger-border hover:bg-status-danger-bg";

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending:    { label: "Pending",    className: warning },
  processing: { label: "Processing", className: info },
  completed:  { label: "Completed",  className: positive },
  cancelled:  { label: "Cancelled",  className: danger },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  paid:     { label: "Paid",     className: positive },
  unpaid:   { label: "Unpaid",   className: danger },
  refunded: { label: "Refunded", className: neutral },
  partial:  { label: "Partial",  className: warning },
};

const inquiryStatusConfig: Record<InquiryStatus, { label: string; className: string }> = {
  unresolved: { label: "Unresolved", className: warning },
  resolved:   { label: "Resolved",   className: positive },
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
