// features/customers/components/CustomerPurchasesPage.tsx


import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPurchases } from "@/lib/mock-data";
import { Eye, Download } from "lucide-react";

export function CustomerPurchasesPage() {
    return (
        <div>
            <PageHeader title="My Purchases" description={`${mockPurchases.length} purchases`} />
            <div className="p-6">
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Purchase ID</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockPurchases.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                                            No purchases yet.{" "}
                                            <Link href="/customer/services" className="text-[var(--color-saffron)] hover:underline">
                                                Browse services
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mockPurchases.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-mono text-xs">{p.id}</TableCell>
                                            <TableCell className="font-medium">{p.service}</TableCell>
                                            <TableCell>₹{p.amount.toLocaleString("en-IN")}</TableCell>
                                            <TableCell><OrderStatusBadge status={p.status as any} /></TableCell>
                                            <TableCell><PaymentStatusBadge status={p.paymentStatus as any} /></TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{p.date}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button variant="ghost" size="icon">
                                                        <Link href={`/customer/purchases/${p.id}`}><Eye className="h-4 w-4" /></Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="Download Invoice">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
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