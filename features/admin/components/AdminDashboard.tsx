// features/admin/components/AdminDashboard.tsx

import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockAnalytics, mockOrders } from "@/lib/mock-data";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { TrendingUp, ShoppingCart, Users, IndianRupee } from "lucide-react";
import Link from "next/link";

export function AdminDashboard() {
    const stats = [
        { label: "Total Revenue", value: `₹${mockAnalytics.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-[var(--color-green)]" },
        { label: "Total Orders", value: mockAnalytics.totalOrders, icon: ShoppingCart, color: "text-[var(--color-saffron)]" },
        { label: "Total Customers", value: mockAnalytics.totalCustomers, icon: Users, color: "text-[var(--color-indigo)]" },
        { label: "Active Orders", value: mockAnalytics.activeOrders, icon: TrendingUp, color: "text-[var(--color-saffron)]" },
    ];

    const recentOrders = mockOrders.slice(0, 5);

    return (
        <div>
            <PageHeader title="Dashboard" description="Welcome back, Admin" />
            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Recent Orders</CardTitle>
                                <CardDescription>Latest 5 orders across all customers</CardDescription>
                            </div>
                            <Link href="/admin/orders" className="text-xs text-[var(--color-saffron)] hover:underline">
                                View all →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{order.customer}</span>
                                        <span className="text-xs text-muted-foreground">{order.service}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium">₹{order.amount.toLocaleString("en-IN")}</span>
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