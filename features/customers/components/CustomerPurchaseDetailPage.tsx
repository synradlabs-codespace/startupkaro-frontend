"use client";

import { useState } from "react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { useCustomerPurchase } from "@/features/customers/hooks/useCustomerPurchases";
import { downloadCustomerInvoice } from "@/features/customers/lib/downloadInvoice";
import { formatCustomerDate, getPurchaseId, getPurchaseServiceName } from "@/features/customers/lib/format";
import { formatINR } from "@/lib/currency";
import { Download, Mail, Phone } from "lucide-react";

export function CustomerPurchaseDetailPage({ id }: { id: string }) {
    const purchaseQuery = useCustomerPurchase(id);
    const purchase = purchaseQuery.data;
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!purchase) return;
        const purchaseId = getPurchaseId(purchase);
        setDownloading(true);
        try {
            await downloadCustomerInvoice(purchaseId);
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
            <div className="p-6 max-w-lg space-y-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Purchase Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Purchase ID", value: purchase.orderNumber ?? purchaseId, mono: true },
                            { label: "Service", value: serviceName },
                            { label: "Amount Paid", value: formatINR(purchase.amount) },
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
                            <PaymentStatusBadge status={purchase.paymentStatus} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Next Steps</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate">
                        <p>
                            StartupKaro will coordinate required documents through our official email. There is no document upload step inside the customer dashboard.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1">
                                <Mail className="h-3 w-3" />
                                Email checklist
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1">
                                <Phone className="h-3 w-3" />
                                Expert call updates
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
