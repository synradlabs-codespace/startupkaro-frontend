"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge, formatPaymentStatus } from "@/components/custom/StatusBadge";
import { usePaymentList } from "@/features/admin/hooks/useAdminPayments";
import { formatDate } from "@/features/admin/lib/format";
import { formatINR } from "@/lib/currency";
import { Search, Eye } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminPaymentsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const paymentsQuery = usePaymentList({
        search: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        limit: pageSize,
    });

    const payments = paymentsQuery.data?.data ?? [];
    const total = paymentsQuery.data?.pagination.total ?? 0;
    const capturedTotal = payments.filter((payment) => payment.status === "captured").reduce((sum, payment) => sum + payment.amount, 0);

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
            <PageHeader title="Payments" description={`${formatINR(capturedTotal)} collected`} />
            <div className="p-6 space-y-4">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate" />
                        <Input
                            placeholder="Search by payment ID, order ID, or customer..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue>{statusFilter === "all" ? "All Statuses" : formatPaymentStatus(statusFilter)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="created">Created</SelectItem>
                            <SelectItem value="authorized">Authorized</SelectItem>
                            <SelectItem value="captured">Captured</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Payment ID</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Order ID</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Customer</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Amount</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentsQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-12">
                                            Loading payments...
                                        </TableCell>
                                    </TableRow>
                                ) : paymentsQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-error-brand py-12">
                                            Failed to load payments
                                        </TableCell>
                                    </TableRow>
                                ) : payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-12">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id} className="hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs text-slate">{payment.id}</TableCell>
                                            <TableCell className="font-mono text-xs text-slate">{payment.orderNumber || payment.orderId.slice(0, 8)}</TableCell>
                                            <TableCell className="font-medium">{payment.customerName}</TableCell>
                                            <TableCell className="font-medium">{formatINR(payment.amount)}</TableCell>
                                            <TableCell><PaymentStatusBadge status={payment.status} /></TableCell>
                                            <TableCell className="text-slate text-sm">{formatDate(payment.createdAt)}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/payments/${payment.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-brand/10 hover:text-charcoal">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
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
