"use client";

import { useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { useCustomerPaymentAttempts, useCustomerPurchase } from "@/features/customers/hooks/useCustomerPurchases";
import { useResumePayment } from "@/features/customers/hooks/useResumePayment";
import { downloadCustomerInvoice, downloadCustomerReceipt } from "@/features/customers/lib/downloadInvoice";
import { formatCustomerDate, getPurchaseId, getPurchaseServiceName } from "@/features/customers/lib/format";
import { getPurchaseAmountDue, getResumablePaymentId, isPaymentResumable } from "@/features/customers/lib/payment";
import { formatINR } from "@/lib/currency";
import { CreditCard, Download, RefreshCw } from "lucide-react";

export function CustomerPurchaseDetailPage({ id }: { id: string }) {
    const purchaseQuery = useCustomerPurchase(id);
    const { resumePayment, isPending: isPaying } = useResumePayment();
    const purchase = purchaseQuery.data;
    const paymentId = purchase ? getResumablePaymentId(purchase) : undefined;
    const attemptsQuery = useCustomerPaymentAttempts(paymentId);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!purchase) return;
        setDownloading(true);
        try {
            await downloadCustomerInvoice(getPurchaseId(purchase));
        } finally {
            setDownloading(false);
        }
    };

    if (purchaseQuery.isLoading) {
        return (
            <div>
                <PageHeader title="Purchase Detail" />
                <div className="p-6 text-sm text-slate">Loading purchase...</div>
            </div>
        );
    }

    if (purchaseQuery.isError || !purchase) {
        return (
            <div>
                <PageHeader title="Purchase Detail" />
                <div className="p-6 text-sm text-error-brand">Failed to load purchase</div>
            </div>
        );
    }

    const purchaseId = getPurchaseId(purchase);
    const serviceName = getPurchaseServiceName(purchase);
    const amountPaid = purchase.amountPaid ?? 0;
    const amountDue = getPurchaseAmountDue(purchase);
    const canPayBalance = amountDue > 0 && purchase.status !== "cancelled" && !paymentId;
    const canRetry = isPaymentResumable(purchase) && Boolean(paymentId);

    // Both buttons resolve to the same call - resumePayment picks retry vs.
    // pay-balance based on whether a created/failed payment exists.
    const handleResume = async () => {
        await resumePayment(purchase).catch(() => {});
    };

    return (
        <div>
            <PageHeader
                title={serviceName}
                description={`Purchase ${purchase.orderNumber ?? purchaseId}`}
                action={
                    <Button variant="outline" size="sm" onClick={handleDownload} disabled={downloading} className="uppercase tracking-wide">
                        <Download className="h-4 w-4 mr-1" /> {downloading ? "Downloading..." : "Invoice"}
                    </Button>
                }
            />
            <div className="p-6 max-w-2xl space-y-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Purchase Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Purchase ID", value: purchase.orderNumber ?? purchaseId, mono: true },
                            { label: "Service", value: serviceName },
                            { label: "Order Amount", value: formatINR(purchase.amount) },
                            { label: "Amount Paid", value: formatINR(amountPaid) },
                            { label: "Amount Due", value: formatINR(amountDue) },
                            { label: "Date", value: formatCustomerDate(purchase.createdAt ?? purchase.date) },
                        ].map(({ label, value, mono }) => (
                            <div key={label} className="flex justify-between gap-4">
                                <span className="text-slate">{label}</span>
                                <span className={mono ? "font-mono text-xs text-right" : "font-medium text-right"}>{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <span className="text-slate">Service Status</span>
                            <OrderStatusBadge status={purchase.status} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate">Payment</span>
                            <PaymentStatusBadge status={purchase.paymentStatus ?? purchase.paymentState ?? "unpaid"} />
                        </div>
                    </CardContent>
                </Card>

                {purchase.items && purchase.items.length > 0 && (
                    <Card>
                        <CardHeader><CardTitle className="text-base">Line Items</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {purchase.items.map((item) => (
                                <div key={item.id} className="rounded-lg border border-hairline bg-surface p-3">
                                    <div className="flex justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-charcoal">{item.name}</p>
                                            <p className="mt-0.5 text-xs text-slate">Qty {item.quantity} x {formatINR(item.unitPrice)}</p>
                                        </div>
                                        <p className="font-medium text-ink">{formatINR(item.amount)}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader><CardTitle className="text-base">Payments</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {canPayBalance && (
                                <Button type="button" onClick={handleResume} disabled={isPaying} className="gap-2 bg-primary-brand text-white hover:bg-primary-brand/90 uppercase tracking-wide">
                                    <CreditCard className="h-4 w-4" />
                                    Pay Balance
                                </Button>
                            )}
                            {canRetry && (
                                <Button type="button" variant="outline" onClick={handleResume} disabled={isPaying} className="gap-2 uppercase tracking-wide">
                                    <RefreshCw className="h-4 w-4" />
                                    Retry Payment
                                </Button>
                            )}
                            {paymentId && (
                                <Button type="button" variant="outline" onClick={() => void downloadCustomerReceipt(paymentId)} className="gap-2 uppercase tracking-wide">
                                    <Download className="h-4 w-4" />
                                    Receipt
                                </Button>
                            )}
                        </div>
                        {attemptsQuery.isLoading ? (
                            <p className="text-sm text-slate">Loading payment attempts...</p>
                        ) : attemptsQuery.data && attemptsQuery.data.length > 0 ? (
                            <div className="space-y-2">
                                {attemptsQuery.data.map((attempt, index) => (
                                    <div key={attempt.id} className="rounded-lg border border-hairline bg-surface px-3 py-2 text-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-slate">
                                                Attempt {attempt.attemptNumber ?? index + 1} · {formatCustomerDate(attempt.createdAt)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-charcoal">{formatINR(attempt.amount)}</span>
                                                {attempt.status && <PaymentStatusBadge status={attempt.status} />}
                                            </div>
                                        </div>
                                        {attempt.errorDescription && (
                                            <p className="mt-1 text-xs text-error-brand">{attempt.errorDescription}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate">No payment attempts available.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Next Steps</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate">
                        <p>
                            StartupKaro will coordinate required documents through our official email. There is no document upload step inside the customer dashboard.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
