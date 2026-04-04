// features/admin/components/AdminOrderEditPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOrders } from "@/lib/mock-data";

export function AdminOrderEditPage({ id }: { id: string }) {
    const router = useRouter();
    const order = mockOrders.find((o) => o.id === id) ?? mockOrders[0];

    const [form, setForm] = useState({
        service: order.service,
        amount: String(order.amount),
        status: order.status,
        paymentStatus: order.paymentStatus,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/orders/${id}`);
    };

    const set = (key: keyof typeof form) => (value: string | null) => {
        setForm((f) => ({ ...f, [key]: value ?? "" }));
    };

    return (
        <div>
            <PageHeader title={`Edit Order ${id}`} description="Update order details" />
            <div className="p-6 max-w-2xl">
                <Card>
                    <CardHeader><CardTitle className="text-base">Edit Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label>Service</Label>
                                <Input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount (₹)</Label>
                                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Order Status</Label>
                                <Select value={form.status} onValueChange={set("status")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Status</Label>
                                <Select value={form.paymentStatus} onValueChange={set("paymentStatus")}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                        <SelectItem value="partial">Partial</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" className="bg-[var(--color-saffron)] hover:bg-[var(--color-saffron)]/90 text-white">
                                    Save Changes
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}