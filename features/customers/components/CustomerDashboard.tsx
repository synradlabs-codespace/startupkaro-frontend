// features/customers/components/CustomerDashboard.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPurchases, mockServices } from "@/lib/mock-data";
import { ShoppingBag, Store, Download } from "lucide-react";

export function CustomerDashboard() {
    return (
        <div>
            <PageHeader title="Dashboard" description="Welcome back, Rahul" />
            <div className="p-6 space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">My Purchases</p>
                                    <p className="text-2xl font-bold mt-1">{mockPurchases.length}</p>
                                </div>
                                <ShoppingBag className="h-8 w-8 text-[var(--color-green)] opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Services Available</p>
                                    <p className="text-2xl font-bold mt-1">{mockServices.length}</p>
                                </div>
                                <Store className="h-8 w-8 text-[var(--color-saffron)] opacity-80" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Purchases */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Recent Purchases</CardTitle>
                                <CardDescription>Your latest service orders</CardDescription>
                            </div>
                            <Link href="/customer/purchases" className="text-xs text-[var(--color-green)] hover:underline">
                                View all →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockPurchases.map((p) => (
                            <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                    <p className="text-sm font-medium">{p.service}</p>
                                    <p className="text-xs text-muted-foreground">{p.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">₹{p.amount.toLocaleString("en-IN")}</span>
                                    <OrderStatusBadge status={p.status as any} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Browse Services CTA */}
                <Card className="border-dashed border-2 border-[var(--color-green)]/30 bg-[var(--color-green)]/5">
                    <CardContent className="pt-6 flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">Need another service?</p>
                            <p className="text-xs text-muted-foreground mt-1">Browse our catalogue and get started today.</p>
                        </div>
                        <Button size="sm" className="bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white">
                            <Link href="/customer/services">Browse Services</Link>
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}