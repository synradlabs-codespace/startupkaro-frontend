"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Download, IndianRupee, ReceiptText, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { useOrderPayments, useRecordOfflinePayment } from "@/features/admin/hooks/useAdminOrders";
import { downloadAdminReceipt } from "@/features/admin/lib/downloadReceipt";
import { formatDate, getApiErrorMessage } from "@/features/admin/lib/format";
import { formatINR, toPaise } from "@/lib/currency";
import { adminPaymentService, type AdminOrderPayment, type AdminOrderPaymentsSummary } from "@/services/admin.service";

type PaymentPayload = AdminOrderPaymentsSummary | AdminOrderPayment[];

function normalizePayments(payload: PaymentPayload | undefined, orderAmount: number): AdminOrderPaymentsSummary {
    if (Array.isArray(payload)) {
        const amountPaid = payload.reduce((sum, payment) => sum + (payment.amount ?? 0), 0);
        const amountDue = Math.max(orderAmount - amountPaid, 0);
        return {
            amount: orderAmount,
            amountPaid,
            amountDue,
            paymentState: amountDue === 0 ? "paid" : amountPaid > 0 ? "partially_paid" : "unpaid",
            payments: payload,
        };
    }

    return {
        amount: payload?.amount ?? orderAmount,
        amountPaid: payload?.amountPaid ?? 0,
        amountDue: payload?.amountDue ?? orderAmount,
        paymentState: payload?.paymentState ?? "unpaid",
        payments: payload?.payments ?? [],
    };
}

function formatPaymentState(state: string) {
    return state.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function OrderPaymentsPanel({ orderId, orderAmount }: { orderId: string; orderAmount: number }) {
    const queryClient = useQueryClient();
    const paymentsQuery = useOrderPayments(orderId);
    const recordPayment = useRecordOfflinePayment(orderId);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("cheque");
    const [reference, setReference] = useState("");
    const [voidingId, setVoidingId] = useState("");
    const [voidReason, setVoidReason] = useState("");
    const [error, setError] = useState("");
    const voidPayment = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => adminPaymentService.voidReceipt(id, { reason }),
        onSuccess: () => {
            setVoidingId("");
            setVoidReason("");
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId, "payments"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", orderId, "history"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
        },
    });
    const summary = useMemo(
        () => normalizePayments(paymentsQuery.data, orderAmount),
        [paymentsQuery.data, orderAmount],
    );

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        try {
            await recordPayment.mutateAsync({
                amount: toPaise(Number(amount)),
                method,
                reference: reference.trim() || undefined,
            });
            setAmount("");
            setReference("");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to record payment"));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="h-4 w-4 text-primary-brand" />
                    Payments
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {paymentsQuery.isLoading ? (
                    <p className="text-sm text-slate">Loading payment ledger...</p>
                ) : paymentsQuery.isError ? (
                    <p className="text-sm text-error-brand">Failed to load payment ledger</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                            <SummaryTile label="Order Amount" value={formatINR(summary.amount)} />
                            <SummaryTile label="Paid" value={formatINR(summary.amountPaid)} />
                            <SummaryTile label="Due" value={formatINR(summary.amountDue)} />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-hairline bg-surface px-3 py-2 text-sm">
                            <span className="text-slate">Payment State</span>
                            <span className="font-medium text-charcoal">{formatPaymentState(String(summary.paymentState))}</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-[0.28px] text-graphite">Receipts</p>
                            {summary.payments.length === 0 ? (
                                <p className="rounded-lg border border-hairline bg-canvas px-3 py-3 text-sm text-slate">
                                    No payments recorded yet.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {summary.payments.map((payment) => (
                                        <div key={payment.id} className="rounded-lg border border-hairline bg-canvas p-3 text-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-medium text-charcoal">{formatINR(payment.amount)}</p>
                                                    <p className="mt-0.5 text-xs text-slate">
                                                        {payment.reference || payment.razorpayPaymentId || payment.method || "Offline receipt"}
                                                    </p>
                                                </div>
                                                {payment.status ? <PaymentStatusBadge status={payment.status} /> : null}
                                            </div>
                                            {(payment.paidAt || payment.createdAt) && (
                                                <p className="mt-2 text-xs text-graphite">
                                                    {formatDate(payment.paidAt ?? payment.createdAt ?? "")}
                                                </p>
                                            )}
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 uppercase tracking-wide" onClick={() => void downloadAdminReceipt(payment.id)}>
                                                    <Download className="h-3.5 w-3.5" />
                                                    Receipt
                                                </Button>
                                                {payment.status !== "voided" && (
                                                    <Button type="button" variant="outline" size="sm" className="h-8 gap-1.5 uppercase tracking-wide" onClick={() => setVoidingId(payment.id)}>
                                                        <Undo2 className="h-3.5 w-3.5" />
                                                        Void
                                                    </Button>
                                                )}
                                            </div>
                                            {voidingId === payment.id && (
                                                <form
                                                    className="mt-3 flex flex-col gap-2 sm:flex-row"
                                                    onSubmit={(event) => {
                                                        event.preventDefault();
                                                        if (voidReason.trim()) voidPayment.mutate({ id: payment.id, reason: voidReason.trim() });
                                                    }}
                                                >
                                                    <Input
                                                        required
                                                        value={voidReason}
                                                        onChange={(event) => setVoidReason(event.target.value)}
                                                        placeholder="Reason for voiding"
                                                        className="h-9"
                                                    />
                                                    <Button type="submit" size="sm" disabled={voidPayment.isPending || !voidReason.trim()} className="h-9 bg-primary-brand text-white hover:bg-primary-brand/90 uppercase tracking-wide">
                                                        Confirm
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <form onSubmit={submit} className="space-y-3 rounded-lg border border-hairline bg-cloud p-4">
                    <div className="flex items-center gap-2">
                        <ReceiptText className="h-4 w-4 text-primary-brand" />
                        <p className="text-sm font-semibold text-charcoal">Record Offline Payment</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-[0.28px] text-graphite">Amount (Rs)</Label>
                            <Input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-[0.28px] text-graphite">Method</Label>
                            <Input
                                required
                                placeholder="cheque / upi / bank_transfer"
                                value={method}
                                onChange={(event) => setMethod(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase tracking-[0.28px] text-graphite">Reference</Label>
                            <Input
                                placeholder="UTR / cheque / txn id"
                                value={reference}
                                onChange={(event) => setReference(event.target.value)}
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-error-brand">{error}</p>}
                    <Button
                        type="submit"
                        disabled={recordPayment.isPending}
                        className="gap-2 bg-primary-brand text-white hover:bg-primary-brand/90 uppercase tracking-wide"
                    >
                        <IndianRupee className="h-4 w-4" />
                        {recordPayment.isPending ? "Recording..." : "Record Payment"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border border-hairline bg-surface p-3">
            <p className="text-xs text-slate">{label}</p>
            <p className="mt-1 font-display text-xl font-medium text-ink">{value}</p>
        </div>
    );
}
