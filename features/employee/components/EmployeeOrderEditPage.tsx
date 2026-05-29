"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatOrderStatus } from "@/components/custom/StatusBadge";
import { useOrder, useUpdateOrder } from "@/features/admin/hooks/useAdminOrders";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { formatINR } from "@/lib/currency";

export function EmployeeOrderEditPage({ id }: { id: string }) {
    const router = useRouter();
    const orderQuery = useOrder(id);
    const updateOrder = useUpdateOrder(id);
    const order = orderQuery.data?.data;

    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleSave = async () => {
        setError("");
        try {
            await updateOrder.mutateAsync({ status: currentStatus });
            router.push(`/employee/orders/${id}`);
        } catch (err) {
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

    const currentStatus = status ?? order.status;
    const statusChanged = status !== null && status !== order.status;

    return (
        <div>
            <PageHeader title={`Edit Order ${order.orderNumber || id}`} description="Update order status" />
            <div className="p-6">
                <Card className="max-w-lg">
                    <CardHeader><CardTitle className="text-base">Order Status</CardTitle></CardHeader>
                    <CardContent className="space-y-5 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate">Customer</span>
                            <span className="font-medium">{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate">Service</span>
                            <span className="font-medium">{order.service.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate">Amount</span>
                            <span className="font-medium">{formatINR(order.amount)}</span>
                        </div>

                        <div className="pt-2 border-t space-y-1.5">
                            <Label className="text-xs text-slate">Update Status</Label>
                            <Select value={currentStatus} onValueChange={(v) => setStatus(v ?? currentStatus)}>
                                <SelectTrigger className="h-8 text-sm">
                                    <SelectValue>{formatOrderStatus(currentStatus)}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error && <p className="text-sm text-error-brand">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button
                                className="bg-primary-brand hover:bg-primary-brand/90 text-white uppercase tracking-wide"
                                onClick={handleSave}
                                disabled={updateOrder.isPending || !statusChanged}
                            >
                                {updateOrder.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button variant="secondary" onClick={() => router.back()} className="uppercase tracking-wide">
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
