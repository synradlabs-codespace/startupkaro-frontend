// features/employee/components/EmployeeOrderDetailPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockOrders } from "@/lib/mock-data";
import { Download, StickyNote, Pencil } from "lucide-react";

export function EmployeeOrderDetailPage({ id }: { id: string }) {
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];
    const notes: string[] = [];

    return (
        <div>
            <PageHeader
                title={`Order ${order.id}`}
                description={order.service}
                action={
                    <div className="flex gap-2">
                        <Link href={`/employee/orders/${order.id}/edit`}>
                            <Button size="sm" className="gap-1.5 bg-[var(--color-indigo)] hover:bg-[var(--color-indigo)]/90 text-white">
                                <Pencil className="h-3.5 w-3.5" /> Edit Order
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Invoice
                        </Button>
                    </div>
                }
            />
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Order Info</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Order ID", value: order.id, mono: true },
                            { label: "Service", value: order.service },
                            { label: "Amount", value: `₹${order.amount.toLocaleString("en-IN")}` },
                            { label: "Date", value: order.date },
                        ].map(({ label, value, mono }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-muted-foreground">{label}</span>
                                <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-1 border-t">
                            <span className="text-muted-foreground">Order Status</span>
                            <OrderStatusBadge status={order.status as any} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Payment Status</span>
                            <PaymentStatusBadge status={order.paymentStatus as any} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Name", value: order.customer },
                            { label: "Email", value: "rahul@example.com" },
                            { label: "Mobile", value: "+91 98765 43210" },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-muted-foreground">{label}</span>
                                <span className="font-medium">{value}</span>
                            </div>
                        ))}
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
                    <CardContent>
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
