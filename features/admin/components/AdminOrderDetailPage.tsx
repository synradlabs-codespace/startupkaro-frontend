// features/admin/components/AdminOrderDetailPage.tsx
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockOrders } from "@/lib/mock-data";
import { Pencil, Download, StickyNote } from "lucide-react";

export function AdminOrderDetailPage({ id }: { id: string }) {
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];
    const notes: string[] = [];

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
                        <Link href={`/admin/orders/${id}/edit`}>
                            <Button size="sm" className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Button>
                        </Link>
                    </div>
                }
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Order Info</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Row label="Order ID" value={order.id} mono />
                        <Row label="Service" value={order.service} />
                        <Row label="Amount" value={`₹${order.amount.toLocaleString("en-IN")}`} />
                        <Row label="Date" value={order.date} />
                        <div className="flex items-center justify-between pt-1 border-t">
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
                            <Link href={`/admin/customers/CUS-001`}>
                                <Button variant="outline" size="sm">View Customer Profile →</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="px-6 pb-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <StickyNote className="h-4 w-4 text-muted-foreground" />
                            Notes
                            {notes.length > 0 && (
                                <span className="text-xs font-normal text-muted-foreground">({notes.length})</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {notes.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No notes added yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {notes.map((note, i) => (
                                    <li key={i} className="bg-muted/40 rounded-lg px-3 py-2 text-sm">
                                        <span className="leading-relaxed">{note}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
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
