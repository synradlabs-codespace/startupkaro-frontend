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
import { PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPayments } from "@/lib/mock-data";
import { Search, Eye } from "lucide-react";

const PAGE_SIZE = 10;

export function AdminPaymentsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const filtered = mockPayments.filter((p) => {
        const matchSearch =
            p.customer.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.orderId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const total = mockPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

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
            <PageHeader title="Payments" description={`₹${total.toLocaleString("en-IN")} collected`} />
            <div className="p-6 space-y-4">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by payment ID, order ID, or customer..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-muted/50">
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
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((payment) => (
                                        <TableRow key={payment.id} className="hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs text-muted-foreground">{payment.id}</TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{payment.orderId}</TableCell>
                                            <TableCell className="font-medium">{payment.customer}</TableCell>
                                            <TableCell className="font-medium">₹{payment.amount.toLocaleString("en-IN")}</TableCell>
                                            <TableCell><PaymentStatusBadge status={payment.status as any} /></TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{payment.date}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/admin/payments/${payment.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--color-green)]/10 hover:text-[var(--color-green)]">
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
                            total={filtered.length}
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
