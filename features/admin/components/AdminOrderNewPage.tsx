"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { useCustomerList } from "@/features/admin/hooks/useAdminCustomers";
import { useCreateOrder } from "@/features/admin/hooks/useAdminOrders";
import { useServiceList } from "@/features/admin/hooks/useAdminServices";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { formatINR, toPaise } from "@/lib/currency";
import { ShoppingBag, User, Briefcase, ClipboardList, PlusCircle, Trash2 } from "lucide-react";

export function AdminOrderNewPage() {
    const router = useRouter();
    const customersQuery = useCustomerList({ page: 1, limit: 100 });
    const servicesQuery = useServiceList({ page: 1, limit: 100 });
    const createOrder = useCreateOrder();
    const [form, setForm] = useState({
        customerId: "",
    });
    const [items, setItems] = useState([{ id: crypto.randomUUID(), serviceId: "", quantity: "1", amount: "" }]);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const payloadItems = items.map((item) => ({
                serviceId: item.serviceId,
                quantity: Math.max(1, Number(item.quantity) || 1),
                amount: toPaise(Number(item.amount)),
            }));
            await createOrder.mutateAsync({
                customerId: form.customerId,
                items: payloadItems,
            });
            router.push("/admin/orders");
        } catch (err: unknown) {
            setError(getApiErrorMessage(err, "Failed to create order"));
        }
    };

    const set = (key: keyof typeof form) => (value: string | null) => {
        setForm((f) => ({ ...f, [key]: value ?? f[key] }));
    };
    const setItem = (id: string, key: "serviceId" | "quantity" | "amount", value: string | null) => {
        setItems((current) => current.map((item) => item.id === id ? { ...item, [key]: value ?? item[key] } : item));
    };
    const addItem = () => setItems((current) => current.concat({ id: crypto.randomUUID(), serviceId: "", quantity: "1", amount: "" }));
    const removeItem = (id: string) => setItems((current) => current.length === 1 ? current : current.filter((item) => item.id !== id));
    const customers = customersQuery.data?.data ?? [];
    const services = servicesQuery.data?.data ?? [];
    const customerOptions = useMemo(
        () =>
            customers.map((customer) => ({
                value: customer.id,
                label: customer.name,
                description: customer.email,
            })),
        [customers]
    );
    const serviceOptions = useMemo(
        () =>
            services.map((service) => ({
                value: service.id,
                label: service.name,
                description: `${service.category} - ${service.type}`,
            })),
        [services]
    );
    const totalAmount = items.reduce((sum, item) => sum + toPaise(Number(item.amount || 0)), 0);

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="New Order" description="Create a new order for a customer" />

            <div className="flex-1 p-6 max-w-4xl space-y-6">
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
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <User className="h-3 w-3" /> Customer
                                </Label>
                                <Combobox
                                    value={form.customerId}
                                    onChange={set("customerId")}
                                    options={customerOptions}
                                    placeholder="Select a customer"
                                    loading={customersQuery.isLoading}
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                        <Briefcase className="h-3 w-3" /> Line Items
                                    </Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2 uppercase tracking-wide">
                                        <PlusCircle className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>
                                {items.map((item, index) => (
                                    <div key={item.id} className="grid grid-cols-1 gap-3 rounded-lg border border-hairline bg-surface p-3 md:grid-cols-[1fr_110px_150px_40px] md:items-end">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate">Service</Label>
                                            <Combobox
                                                value={item.serviceId}
                                                onChange={(value) => setItem(item.id, "serviceId", value)}
                                                options={serviceOptions}
                                                placeholder={`Select service ${index + 1}`}
                                                loading={servicesQuery.isLoading}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate">Quantity</Label>
                                            <Input
                                                required
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={item.quantity}
                                                onChange={(e) => setItem(item.id, "quantity", e.target.value)}
                                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate">Amount (Rs)</Label>
                                            <Input
                                                required
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.amount}
                                                onChange={(e) => setItem(item.id, "amount", e.target.value)}
                                                className="rounded-lg border-hairline focus-visible:ring-primary-brand/20"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                            disabled={items.length === 1}
                                            className="h-10 w-10 text-slate hover:text-error-brand"
                                            title="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex justify-end text-sm">
                                    <span className="rounded-md border border-hairline bg-canvas px-3 py-2 font-medium text-charcoal">
                                        Total {formatINR(totalAmount)}
                                    </span>
                                </div>
                            </div>
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
