// features/admin/components/AdminOrderDetailPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockOrders } from "@/lib/mock-data";
import { Pencil, Download } from "lucide-react";

export function AdminOrderDetailPage({ id }: { id: string }) {
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];

    return (
        <div>
            <PageHeader
                title={`Order ${order.id}`}
                description={order.service}
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Invoice
                        </Button>
                        <Button size="sm" className="bg-[var(--color-saffron)] hover:bg-[var(--color-saffron)]/90 text-white">
                            <Link href={`/admin/orders/${id}/edit`}>
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Link>
                        </Button>
                    </div>
                }
            />
            < div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4" >
                <Card>
                    <CardHeader><CardTitle className="text-base">Order Info</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Row label="Order ID" value={order.id} mono />
                        <Row label="Service" value={order.service} />
                        <Row label="Amount" value={`₹${order.amount.toLocaleString("en-IN")}`} />
                        <Row label="Date" value={order.date} />
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Order Status</span>
                            <OrderStatusBadge status={order.status as any} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Payment Status</span>
                            <PaymentStatusBadge status={order.paymentStatus as any} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Customer Info</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Row label="Name" value={order.customer} />
                        <Row label="Email" value="rahul@example.com" />
                        <Row label="Mobile" value="+91 98765 43210" />
                        <div className="pt-2">
                            <Button variant="outline" size="sm">
                                <Link href={`/admin/customers/CUS-001`}>View Customer Profile →</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div >
        </div >
    );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
        </div>
    );
}