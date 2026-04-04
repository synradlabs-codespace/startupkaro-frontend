// features/admin/components/AdminCustomerDetailPage.tsx

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockCustomers } from "@/lib/mock-data";
import { Mail, Phone, ShoppingCart } from "lucide-react";

export function AdminCustomerDetailPage({ id }: { id: string }) {
    const customer = mockCustomers.find((c) => c.id === id) ?? mockCustomers[0];

    return (
        <div>
            <PageHeader title="Customer Profile" />
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-3">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-lg bg-[var(--color-saffron)]/10 text-[var(--color-saffron)]">
                                    {customer.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-base">{customer.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{customer.id}</p>
                            </div>
                            <div className="w-full space-y-2 pt-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4 shrink-0" />
                                    <span>{customer.mobile}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <ShoppingCart className="h-4 w-4 shrink-0" />
                                    <span>{customer.orders} orders</span>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground pt-1">Joined {customer.joined}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Orders</CardTitle>
                            <Button variant="outline" size="sm">
                                <Link href={`/admin/customers/${id}/orders`}>View All Orders</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {customer.orders === 0
                                ? "This customer has no orders yet."
                                : `${customer.orders} order(s) placed. Click "View All Orders" to see details.`}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}