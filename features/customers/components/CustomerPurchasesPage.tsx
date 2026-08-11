"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { TablePagination } from "@/components/custom/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { useCustomerPurchaseList } from "@/features/customers/hooks/useCustomerPurchases";
import { useResumePayment } from "@/features/customers/hooks/useResumePayment";
import { downloadCustomerInvoice } from "@/features/customers/lib/downloadInvoice";
import { formatCustomerDate, getPurchaseId, getPurchaseServiceName } from "@/features/customers/lib/format";
import { isPaymentResumable } from "@/features/customers/lib/payment";
import { formatINR } from "@/lib/currency";
import type { CustomerPurchase } from "@/services/customer.service";
import { Eye, Download, RefreshCw } from "lucide-react";

const PAGE_SIZE = 50;

export function CustomerPurchasesPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [downloadingId, setDownloadingId] = useState("");
    const [resumingId, setResumingId] = useState("");
    const purchasesQuery = useCustomerPurchaseList({ page, limit: pageSize });
    const { resumePayment } = useResumePayment();
    const purchases = purchasesQuery.data?.data ?? [];
    const total = purchasesQuery.data?.pagination.total ?? 0;

    const handleRetry = async (purchase: CustomerPurchase) => {
        setResumingId(getPurchaseId(purchase));
        try {
            await resumePayment(purchase);
        } catch {
            // useResumePayment already surfaces a toast for dismiss/decline/errors.
        } finally {
            setResumingId("");
        }
    };

    const handleDownload = async (orderId: string) => {
        setDownloadingId(orderId);
        try {
            await downloadCustomerInvoice(orderId);
        } finally {
            setDownloadingId("");
        }
    };

    return (
        <div>
            <PageHeader title="My Purchases" description={`${total} purchases`} />
            <div className="p-6">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
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
                                {purchasesQuery.isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-12">
                                            Loading purchases...
                                        </TableCell>
                                    </TableRow>
                                ) : purchasesQuery.isError ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-error-brand py-12">
                                            Failed to load purchases
                                        </TableCell>
                                    </TableRow>
                                ) : purchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate py-12">
                                            No purchases yet.{" "}
                                            <Link href="/customer/services" className="text-charcoal hover:underline">
                                                Browse services
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    purchases.map((purchase) => {
                                        const purchaseId = getPurchaseId(purchase);
                                        const resumable = isPaymentResumable(purchase);
                                        const isPaid = (purchase.paymentState ?? purchase.paymentStatus) === "paid" || purchase.paymentStatus === "captured";
                                        return (
                                            <TableRow key={purchaseId} className="hover:bg-muted/30">
                                                <TableCell className="font-mono text-xs text-slate">{purchase.orderNumber ?? purchaseId}</TableCell>
                                                <TableCell className="font-medium">{getPurchaseServiceName(purchase)}</TableCell>
                                                <TableCell>
                                                    <span className="font-medium">{formatINR(purchase.amount)}</span>
                                                    {resumable && <p className="mt-0.5 text-xs text-status-warning-fg">Payment pending</p>}
                                                </TableCell>
                                                <TableCell><OrderStatusBadge status={purchase.status} /></TableCell>
                                                <TableCell><PaymentStatusBadge status={purchase.paymentStatus ?? purchase.paymentState ?? "unpaid"} /></TableCell>
                                                <TableCell className="text-slate text-sm">{formatCustomerDate(purchase.createdAt ?? purchase.date)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        {resumable && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 gap-1.5 uppercase tracking-wide"
                                                                onClick={() => handleRetry(purchase)}
                                                                disabled={resumingId === purchaseId}
                                                            >
                                                                <RefreshCw className="h-3.5 w-3.5" />
                                                                Retry
                                                            </Button>
                                                        )}
                                                        <Link href={`/customer/purchases/${purchaseId}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent-customer hover:text-charcoal">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {isPaid && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-muted"
                                                                title="Download Invoice"
                                                                onClick={() => handleDownload(purchaseId)}
                                                                disabled={downloadingId === purchaseId}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
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
