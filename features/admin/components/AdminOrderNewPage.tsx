"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomerList } from "@/features/admin/hooks/useAdminCustomers";
import { useCreateOrder } from "@/features/admin/hooks/useAdminOrders";
import { formatOrderStatus } from "@/components/custom/StatusBadge";
import { useServiceList } from "@/features/admin/hooks/useAdminServices";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { toPaise } from "@/lib/currency";
import { ShoppingBag, User, Briefcase, IndianRupee, ClipboardList, StickyNote } from "lucide-react";

export function AdminOrderNewPage() {
    const router = useRouter();
    const customersQuery = useCustomerList({ page: 1, limit: 100 });
    const servicesQuery = useServiceList({ page: 1, limit: 100 });
    const createOrder = useCreateOrder();
    const [form, setForm] = useState({
        customerId: "",
        serviceId: "",
        amount: "",
        status: "pending",
        notes: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await createOrder.mutateAsync({
                customerId: form.customerId,
                serviceId: form.serviceId,
                amount: toPaise(Number(form.amount)),
                status: form.status,
                notes: form.notes || undefined,
            });
            router.push("/admin/orders");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to create order"));
        }
    };

    const set = (key: keyof typeof form) => (value: string | null) => {
        setForm((f) => ({ ...f, [key]: value ?? f[key] }));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="New Order" description="Create a new order for a customer" />

            <div className="flex-1 p-6 max-w-2xl space-y-6">
                <div className="rounded-xl bg-primary-brand p-8">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="h-16 w-16 rounded-lg bg-white/15 flex items-center justify-center">
                            <ShoppingBag className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-base">New Order</p>
                            <p className="text-xs text-white/70 mt-0.5">Assign a service to a customer and set the payment details</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <ClipboardList className="h-3.5 w-3.5 text-primary-brand" />
                        </div>
                        <h3 className="text-sm font-semibold text-charcoal">Order Details</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <User className="h-3 w-3" /> Customer
                                </Label>
                                <Select value={form.customerId} onValueChange={set("customerId")}>
                                    <SelectTrigger className="rounded-lg border-hairline focus:ring-primary-brand/20">
                                        <SelectValue placeholder={customersQuery.isLoading ? "Loading customers..." : "Select a customer"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(customersQuery.data?.data ?? []).map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id}>{customer.name} - {customer.email}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <Briefcase className="h-3 w-3" /> Service
                                </Label>
                                <Select value={form.serviceId} onValueChange={set("serviceId")}>
                                    <SelectTrigger className="rounded-lg border-hairline focus:ring-primary-brand/20">
                                        <SelectValue placeholder={servicesQuery.isLoading ? "Loading services..." : "Select a service"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(servicesQuery.data?.data ?? []).map((service) => (
                                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <IndianRupee className="h-3 w-3" /> Amount (Rs)
                                </Label>
                                <Input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Amount"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <ClipboardList className="h-3 w-3" /> Status
                                </Label>
                                <Select value={form.status} onValueChange={set("status")}>
                                    <SelectTrigger className="rounded-lg border-hairline focus:ring-primary-brand/20">
                                        <SelectValue>{formatOrderStatus(form.status)}</SelectValue>
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
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <StickyNote className="h-3 w-3" /> Notes (optional)
                            </Label>
                            <Input
                                placeholder="Any additional notes..."
                                value={form.notes}
                                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                            />
                        </div>

                        {error && <p className="text-sm text-error-brand">{error}</p>}

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={createOrder.isPending}
                                className="bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg gap-2 uppercase tracking-wide"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                {createOrder.isPending ? "Creating..." : "Create Order"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.push("/admin/orders")}
                                className="rounded-lg uppercase tracking-wide"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
