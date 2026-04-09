// features/customers/components/CustomerPurchasesPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPurchases } from "@/lib/mock-data";
import { Eye, Download } from "lucide-react";

const PAGE_SIZE = 10;

export function CustomerPurchasesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);

    const paginated = mockPurchases.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div>
            <PageHeader title="My Purchases" description={`${mockPurchases.length} purchases`} />
            <div className="p-6">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-muted/50">
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Purchase ID</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Service</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Amount</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Status</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Payment</TableHead>
                                    <TableHead className="font-semibold text-foreground/70 uppercase text-xs tracking-wide">Date</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground/70 uppercase text-xs tracking-wide">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                            No purchases yet.{" "}
                                            <Link href="/customer/services" className="text-[var(--color-saffron)] hover:underline">
                                                Browse services
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginated.map((p) => (
                                        <TableRow key={p.id} className="hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                                            <TableCell className="font-medium">{p.service}</TableCell>
                                            <TableCell className="font-medium">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                                            <TableCell><OrderStatusBadge status={p.status as any} /></TableCell>
                                            <TableCell><PaymentStatusBadge status={p.paymentStatus as any} /></TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Link href={`/customer/purchases/${p.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[var(--color-saffron)]/10 hover:text-[var(--color-saffron)]">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" title="Download Invoice">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            total={mockPurchases.length}
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
