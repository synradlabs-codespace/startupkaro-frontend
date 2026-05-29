"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentStatusBadge, formatOrderStatus } from "@/components/custom/StatusBadge";
import { useOrder, useUpdateOrder } from "@/features/admin/hooks/useAdminOrders";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { toPaise } from "@/lib/currency";

export function AdminOrderEditPage({ id }: { id: string }) {
    const router = useRouter();
    const orderQuery = useOrder(id);
    const updateOrder = useUpdateOrder(id);
    const order = orderQuery.data?.data;

    const [amount, setAmount] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await updateOrder.mutateAsync({
                status: currentStatus,
                amount: toPaise(Number(currentAmount)),
            });
            router.push(`/admin/orders/${id}`);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to update order"));
        }
    };

    if (orderQuery.isLoading) {
        return (
            <div>
                <PageHeader title={`Edit Order ${id}`} />
                <div className="p-6 text-sm text-slate">Loading order...</div>
            </div>
        );
    }

    if (orderQuery.isError || !order) {
        return (
            <div>
                <PageHeader title={`Edit Order ${id}`} />
                <div className="p-6 text-sm text-error-brand">Failed to load order</div>
            </div>
        );
    }

    const currentAmount = amount ?? String(order.amount / 100);
    const currentStatus = status ?? order.status;

    return (
        <div>
            <PageHeader title={`Edit Order ${order.orderNumber || id}`} description="Update order details" />
            <div className="p-6">
                <Card className="max-w-lg">
                    <CardHeader><CardTitle className="text-base">Edit Details</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label>Service</Label>
                                <Input value={order.service.name} readOnly className="bg-surface" />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount (Rs)</Label>
                                <Input type="number" min="0" step="0.01" value={currentAmount} onChange={(e) => setAmount(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Order Status</Label>
                                <Select value={currentStatus} onValueChange={(value) => setStatus(value ?? currentStatus)}>
                                    <SelectTrigger><SelectValue>{formatOrderStatus(currentStatus)}</SelectValue></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Status</Label>
                                <div className="h-10 flex items-center">
                                    <PaymentStatusBadge status={order.paymentStatus} />
                                </div>
                            </div>
                            {error && <p className="text-sm text-error-brand">{error}</p>}
                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={updateOrder.isPending} className="bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide">
                                    {updateOrder.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => router.back()} className="uppercase tracking-wide">
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
