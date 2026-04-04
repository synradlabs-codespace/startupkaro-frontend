// features/customers/components/CustomerPurchaseDetailPage.tsx

import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPurchases } from "@/lib/mock-data";
import { Download } from "lucide-react";

export function CustomerPurchaseDetailPage({ id }: { id: string }) {
    const purchase = mockPurchases.find((p) => p.id === id) ?? mockPurchases[0];

    return (
        <div>
            <PageHeader
                title={purchase.service}
                description={`Purchase ${purchase.id}`}
                action={
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" /> Download Invoice
                    </Button>
                }
            />
            <div className="p-6 max-w-lg">
                <Card>
                    <CardHeader><CardTitle className="text-base">Purchase Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Purchase ID", value: purchase.id, mono: true },
                            { label: "Service", value: purchase.service },
                            { label: "Amount Paid", value: `₹${purchase.amount.toLocaleString("en-IN")}` },
                            { label: "Date", value: purchase.date },
                        ].map(({ label, value, mono }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-muted-foreground">{label}</span>
                                <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Service Status</span>
                            <OrderStatusBadge status={purchase.status as any} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment</span>
                            <PaymentStatusBadge status={purchase.paymentStatus as any} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}