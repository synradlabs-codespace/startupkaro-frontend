// features/admin/components/AdminPaymentsDetailPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPayments } from "@/lib/mock-data";

export function AdminPaymentDetailPage({ id }: { id: string }) {
    const payment = mockPayments.find((p) => p.id === id) ?? mockPayments[0];

    return (
        <div>
            <PageHeader title={`Payment ${payment.id}`} />
            <div className="p-6 max-w-lg">
                <Card>
                    <CardHeader><CardTitle className="text-base">Payment Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Payment ID", value: payment.id, mono: true },
                            { label: "Order ID", value: payment.orderId, mono: true },
                            { label: "Customer", value: payment.customer },
                            { label: "Amount", value: `₹${payment.amount.toLocaleString("en-IN")}` },
                            { label: "Method", value: payment.method },
                            { label: "Date", value: payment.date },
                        ].map(({ label, value, mono }) => (
                            <div key={label} className="flex items-center justify-between">
                                <span className="text-muted-foreground">{label}</span>
                                <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <PaymentStatusBadge status={payment.status as any} />
                        </div>
                        <div className="pt-3">
                            <Button variant="outline" size="sm">
                                <Link href={`/admin/orders/${payment.orderId}`}>View Order →</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}