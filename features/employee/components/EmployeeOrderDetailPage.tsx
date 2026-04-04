// features/employee/components/EmployeeOrderDetailPage.tsx

import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockOrders } from "@/lib/mock-data";
import { Download } from "lucide-react";

export function EmployeeOrderDetailPage({ id }: { id: string }) {
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];

    return (
        <div>
            <PageHeader
                title={`Order ${order.id}`}
                description={order.service}
                action={
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" /> Invoice
                    </Button>
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
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Status</span>
                            <OrderStatusBadge status={order.status as any} />
                        </div>
                        <div className="flex justify-between">
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
        </div>
    );
}