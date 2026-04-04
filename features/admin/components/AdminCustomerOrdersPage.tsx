// features/admin/components/AdminCustomerOrdersPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockOrders, mockCustomers } from "@/lib/mock-data";
import { Eye } from "lucide-react";

export function AdminCustomerOrdersPage({ customerId }: { customerId: string }) {
    const customer = mockCustomers.find((c) => c.id === customerId) ?? mockCustomers[0];
    // In real app, filter by customerId from API
    const orders = mockOrders.slice(0, customer.orders || 1);

    return (
        <div>
            <PageHeader
                title={`${customer.name}'s Orders`}
                description={`${orders.length} orders`}
                action={
                    <Button variant="outline" size="sm">
                        <Link href={`/admin/customers/${customerId}`}>← Back to Profile</Link>
                    </Button>
                }
            />
            <div className="p-6">
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                                        <TableCell>{order.service}</TableCell>
                                        <TableCell>₹{order.amount.toLocaleString("en-IN")}</TableCell>
                                        <TableCell><OrderStatusBadge status={order.status as any} /></TableCell>
                                        <TableCell><PaymentStatusBadge status={order.paymentStatus as any} /></TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Link href={`/admin/orders/${order.id}`}><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}