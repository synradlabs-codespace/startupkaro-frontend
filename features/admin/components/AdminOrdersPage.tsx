"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge, formatOrderStatus } from "@/components/custom/StatusBadge";
import { useOrderList } from "@/features/admin/hooks/useAdminOrders";
import { formatDate } from "@/features/admin/lib/format";
import { formatINR } from "@/lib/currency";
import { Plus, Search, Eye, Pencil } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminOrdersPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const ordersQuery = useOrderList({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        limit: pageSize,
    });

    const orders = ordersQuery.data?.data ?? [];
    const total = ordersQuery.data?.pagination.total ?? 0;

    const handleFilterChange = (value: string | null) => {
        setStatusFilter(value ?? "all");
        setPage(1);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <PageHeader
                title="Orders"
                description={`${total} total orders`}
                action={
                    <Link href="/admin/orders/new">
                        <Button size="sm" className="bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide">
                            <Plus className="h-4 w-4 mr-1" /> New Order
                        </Button>
                    </Link>
                }
            />
            <div className="p-6 space-y-4">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                        <Input
                            placeholder="Search by order ID, customer, or service..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue>{statusFilter === "all" ? "All Statuses" : formatOrderStatus(statusFilter)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Order ID</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Customer</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Service</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Amount</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Payment</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ordersQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-slate py-12">
                                            Loading orders...
                                        </TableCell>
                                    </TableRow>
                                ) : ordersQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-error-brand py-12">
                                            Failed to load orders
                                        </TableCell>
                                    </TableRow>
                                ) : orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-slate py-12">
                                            No orders found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs text-slate">{order.orderNumber || order.id.slice(0, 8)}</TableCell>
                                            <TableCell className="font-medium">{order.customer.name}</TableCell>
                                            <TableCell className="text-slate text-sm">{order.service.name}</TableCell>
                                            <TableCell className="font-medium">{formatINR(order.amount)}</TableCell>
                                            <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                                            <TableCell><PaymentStatusBadge status={order.paymentStatus} /></TableCell>
                                            <TableCell className="text-slate text-sm">{formatDate(order.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/orders/${order.id}/edit`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            total={total}
                            page={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={setPageSize}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
