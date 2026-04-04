"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPayments } from "@/lib/mock-data";
import { Search, Eye } from "lucide-react";

export function AdminPaymentsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = mockPayments.filter((p) => {
        const matchSearch =
            p.customer.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.orderId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const total = mockPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

    return (
        <div>
            <PageHeader title="Payments" description={`₹${total.toLocaleString("en-IN")} collected`} />
            <div className="p-6 space-y-4">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
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

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment ID</TableHead>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                                        <TableCell className="font-mono text-xs">{payment.orderId}</TableCell>
                                        <TableCell className="font-medium">{payment.customer}</TableCell>
                                        <TableCell>₹{payment.amount.toLocaleString("en-IN")}</TableCell>
                                        <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                                        <TableCell><PaymentStatusBadge status={payment.status as any} /></TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{payment.date}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <Link href={`/admin/payments/${payment.id}`}><Eye className="h-4 w-4" /></Link>
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