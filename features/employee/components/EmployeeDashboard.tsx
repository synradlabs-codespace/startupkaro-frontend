// features/employee/components/EmployeeDashboard.tsx

import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockOrders, mockCustomers, mockInquiries } from "@/lib/mock-data";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { ShoppingCart, Users, MessageSquare } from "lucide-react";
import Link from "next/link";

export function EmployeeDashboard() {
    const stats = [
        { label: "Total Orders", value: mockOrders.length, icon: ShoppingCart, color: "text-[var(--color-saffron)]" },
        { label: "Customers", value: mockCustomers.length, icon: Users, color: "text-[var(--color-indigo)]" },
        { label: "Inquiries", value: mockInquiries.length, icon: MessageSquare, color: "text-[var(--color-green)]" },
    ];

    return (
        <div>
            <PageHeader title="Dashboard" description="Welcome back" />
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Recent Orders</CardTitle>
                                <CardDescription>Latest orders to action</CardDescription>
                            </div>
                            <Link href="/employee/orders" className="text-xs text-[var(--color-indigo)] hover:underline">View all →</Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockOrders.slice(0, 4).map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{order.customer}</p>
                                        <p className="text-xs text-muted-foreground">{order.service}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <OrderStatusBadge status={order.status as any} />
                                        <PaymentStatusBadge status={order.paymentStatus as any} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}