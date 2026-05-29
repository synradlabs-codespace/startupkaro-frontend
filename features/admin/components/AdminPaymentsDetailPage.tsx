"use client";

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { usePayment } from "@/features/admin/hooks/useAdminPayments";
import { formatDate } from "@/features/admin/lib/format";
import { formatINR } from "@/lib/currency";
import { CreditCard, Hash, User, IndianRupee, Smartphone, Calendar, ShieldCheck } from "lucide-react";

export function AdminPaymentDetailPage({ id }: { id: string }) {
    const paymentQuery = usePayment(id);
    const payment = paymentQuery.data?.data;

    if (paymentQuery.isLoading) {
        return (
            <div>
                <PageHeader title={`Payment ${id}`} />
                <div className="p-6 text-sm text-slate">Loading payment...</div>
            </div>
        );
    }

    if (paymentQuery.isError || !payment) {
        return (
            <div>
                <PageHeader title={`Payment ${id}`} />
                <div className="p-6 text-sm text-error-brand">Failed to load payment</div>
            </div>
        );
    }

    const paymentId = payment.razorpayPaymentId ?? payment.id;
    const details = [
        { label: "Payment ID", value: paymentId, icon: Hash, mono: true },
        { label: "Order ID", value: payment.orderNumber || payment.orderId.slice(0, 8), icon: CreditCard, mono: true },
        { label: "Customer", value: payment.customerName, icon: User, mono: false },
        { label: "Amount", value: formatINR(payment.amount), icon: IndianRupee, mono: false },
        { label: "Method", value: payment.method ?? "-", icon: Smartphone, mono: false },
        { label: "Date", value: formatDate(payment.createdAt), icon: Calendar, mono: false },
    ] as const;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title={`Payment ${paymentId}`} />

            <div className="flex-1 p-6 max-w-4xl">
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    <div className="flex items-center gap-4 px-6 py-4 bg-primary-brand">
                        <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-sm">{payment.customerName}</p>
                            <p className="text-xl font-display font-medium text-white">{formatINR(payment.amount)}</p>
                        </div>
                        <p className="ml-auto font-mono text-xs text-white/70">{paymentId}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="p-6 space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-hairline">
                                <div className="h-6 w-6 rounded-md bg-primary-brand/10 flex items-center justify-center">
                                    <CreditCard className="h-3 w-3 text-primary-brand" />
                                </div>
                                <h3 className="text-xs font-semibold text-slate uppercase tracking-wide">Payment Details</h3>
                            </div>
                            {details.map(({ label, value, icon: Icon, mono }) => (
                                <div key={label} className="flex items-center gap-3 py-1.5">
                                    <Icon className="h-3.5 w-3.5 text-stone shrink-0" />
                                    <span className="text-xs text-steel w-20 shrink-0">{label}</span>
                                    <span className={`text-sm ml-auto text-right ${mono ? "font-mono text-xs text-slate" : "font-medium text-charcoal"}`}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-hairline">
                                <div className="h-6 w-6 rounded-md bg-primary-brand/10 flex items-center justify-center">
                                    <ShieldCheck className="h-3 w-3 text-primary-brand" />
                                </div>
                                <h3 className="text-xs font-semibold text-slate uppercase tracking-wide">Payment Status</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                                    <span className="text-sm text-slate">Current status</span>
                                    <PaymentStatusBadge status={payment.status} />
                                </div>

                                <Link href={`/admin/orders/${payment.orderId}`}>
                                    <Button variant="outline" size="sm" className="w-full rounded-lg mt-1 uppercase tracking-wide">
                                        View Associated Order
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
