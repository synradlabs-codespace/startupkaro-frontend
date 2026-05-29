import { Badge } from "@/components/ui/badge";

type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
type PaymentStatus = "created" | "authorized" | "captured" | "failed" | "refunded";
type InquiryStatus = "unresolved" | "resolved";
type Role = "admin" | "employee" | "customer";
type ActiveStatus = "active" | "inactive";

const positive = "bg-status-positive-bg text-status-positive-fg border-status-positive-border hover:bg-status-positive-bg";
const warning  = "bg-status-warning-bg text-status-warning-fg border-status-warning-border hover:bg-status-warning-bg";
const info     = "bg-status-info-bg text-status-info-fg border-status-info-border hover:bg-status-info-bg";
const neutral  = "bg-status-neutral-bg text-status-neutral-fg border-status-neutral-border hover:bg-status-neutral-bg";
const danger   = "bg-status-danger-bg text-status-danger-fg border-status-danger-border hover:bg-status-danger-bg";

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending:     { label: "Pending",     className: warning },
  confirmed:   { label: "Confirmed",   className: info },
  in_progress: { label: "In Progress", className: neutral },
  completed:   { label: "Completed",   className: positive },
  cancelled:   { label: "Cancelled",   className: danger },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  created:    { label: "Created",    className: neutral },
  authorized: { label: "Authorized", className: info },
  captured:   { label: "Captured",   className: positive },
  failed:     { label: "Failed",     className: danger },
  refunded:   { label: "Refunded",   className: warning },
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
  const config = paymentStatusConfig[status as PaymentStatus] ?? paymentStatusConfig.created;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function InquiryStatusBadge({ status }: { status: string }) {
  const config = inquiryStatusConfig[status as InquiryStatus] ?? inquiryStatusConfig.unresolved;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

const roleConfig: Record<Role, { label: string; className: string }> = {
  admin:    { label: "Admin",    className: info },
  employee: { label: "Employee", className: neutral },
  customer: { label: "Customer", className: neutral },
};

const activeStatusConfig: Record<ActiveStatus, { label: string; className: string }> = {
  active:   { label: "Active",   className: positive },
  inactive: { label: "Inactive", className: danger },
};

export function RoleBadge({ role }: { role: string }) {
  const config = roleConfig[role as Role] ?? roleConfig.employee;
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  const config = activeStatusConfig[isActive ? "active" : "inactive"];
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export const formatRole = (role: string) => roleConfig[role as Role]?.label ?? role;
export const formatActiveStatus = (isActive: boolean) => activeStatusConfig[isActive ? "active" : "inactive"].label;
export const formatOrderStatus = (status: string) =>
  orderStatusConfig[status as OrderStatus]?.label ??
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const formatPaymentStatus = (status: string) => paymentStatusConfig[status as PaymentStatus]?.label ?? status;
export const formatInquiryStatus = (status: string) => inquiryStatusConfig[status as InquiryStatus]?.label ?? status;
