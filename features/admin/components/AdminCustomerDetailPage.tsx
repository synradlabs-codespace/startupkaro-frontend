"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { useCustomer } from "@/features/admin/hooks/useAdminCustomers";
import { useCustomerOrders } from "@/features/admin/hooks/useAdminOrders";
import { downloadInvoice } from "@/features/admin/lib/downloadInvoice";
import { formatDate, getInitials } from "@/features/admin/lib/format";
import { formatINR } from "@/lib/currency";
import { Mail, Phone, Eye, Download } from "lucide-react";

export function AdminCustomerDetailPage({ id }: { id: string }) {
    const customerQuery = useCustomer(id);
    const ordersQuery = useCustomerOrders(id);
    const customer = customerQuery.data?.data;
    const orders = ordersQuery.data?.data ?? [];
    const [downloadingId, setDownloadingId] = useState("");

    const handleDownloadInvoice = async (orderId: string) => {
        setDownloadingId(orderId);
        try {
            await downloadInvoice(orderId);
        } finally {
            setDownloadingId("");
        }
    };

    if (customerQuery.isLoading) {
        return (
            <div>
                <PageHeader title="Customer Profile" />
                <div className="p-6 text-sm text-slate">Loading customer...</div>
            </div>
        );
    }

    if (customerQuery.isError || !customer) {
        return (
            <div>
                <PageHeader title="Customer Profile" />
                <div className="p-6 text-sm text-error-brand">Failed to load customer</div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader title="Customer Profile" />
            <div className="p-6 space-y-4">
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                                <AvatarFallback className="text-base bg-primary-brand/10 text-primary-brand">
                                    {getInitials(customer.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold text-base">{customer.name}</p>
                                <div className="flex gap-4 mt-1 text-sm text-slate flex-wrap">
                                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{customer.email}</span>
                                    {customer.phone && (
                                        <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate mt-1">Joined {formatDate(customer.createdAt)} | {ordersQuery.data?.pagination.total ?? 0} orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-base">Orders</CardTitle></CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ordersQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-8">
                                            Loading orders...
                                        </TableCell>
                                    </TableRow>
                                ) : ordersQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-error-brand py-8">
                                            Failed to load orders
                                        </TableCell>
                                    </TableRow>
                                ) : orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-8">
                                            Orders will appear here
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs">{order.orderNumber || order.id.slice(0, 8)}</TableCell>
                                            <TableCell>{order.service.name}</TableCell>
                                            <TableCell>{formatINR(order.amount)}</TableCell>
                                            <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                                            <TableCell><PaymentStatusBadge status={order.paymentStatus} /></TableCell>
                                            <TableCell className="text-slate text-sm">{formatDate(order.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal"
                                                        onClick={() => handleDownloadInvoice(order.id)}
                                                        disabled={downloadingId === order.id}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
