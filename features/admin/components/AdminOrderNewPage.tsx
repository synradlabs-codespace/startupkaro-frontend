"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerList } from "@/features/admin/hooks/useAdminCustomers";
import { useCreateOrder } from "@/features/admin/hooks/useAdminOrders";
import { useServiceList } from "@/features/admin/hooks/useAdminServices";
import { getApiErrorMessage } from "@/features/admin/lib/format";
import { formatINR, toPaise } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, ShoppingBag, User, Briefcase, ClipboardList, PlusCircle, Trash2 } from "lucide-react";

type SearchableOption = {
    value: string;
    label: string;
    description?: string;
    searchText: string;
};

function SearchablePicker({
    value,
    onChange,
    options,
    placeholder,
    searchPlaceholder,
    emptyMessage,
    loading,
}: {
    value: string;
    onChange: (value: string) => void;
    options: SearchableOption[];
    placeholder: string;
    searchPlaceholder: string;
    emptyMessage: string;
    loading?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const selected = options.find((option) => option.value === value);
    const normalizedQuery = query.trim().toLowerCase();
    const filteredOptions = useMemo(
        () => options.filter((option) => option.searchText.toLowerCase().includes(normalizedQuery)),
        [normalizedQuery, options]
    );

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [open]);

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                disabled={loading}
                className={cn(
                    "flex h-11 w-full items-center justify-between gap-3 rounded-lg border border-hairline bg-canvas px-3 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-brand/20",
                    loading && "cursor-not-allowed opacity-60"
                )}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="min-w-0">
                    {selected ? (
                        <span className="flex min-w-0 flex-col">
                            <span className="truncate font-medium text-ink">{selected.label}</span>
                            {selected.description && <span className="truncate text-xs text-slate">{selected.description}</span>}
                        </span>
                    ) : (
                        <span className="text-slate">{loading ? "Loading..." : placeholder}</span>
                    )}
                </span>
                <ChevronsUpDown className="h-4 w-4 shrink-0 text-stone" />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-50 overflow-hidden rounded-lg border border-hairline bg-canvas shadow-[0_18px_45px_rgba(26,26,26,0.14)]">
                    <div className="flex items-center gap-2 border-b border-hairline px-3 py-2">
                        <Search className="h-3.5 w-3.5 shrink-0 text-stone" />
                        <Input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                        />
                    </div>
                    <div className="max-h-72 overflow-y-auto p-1" role="listbox">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-slate">{emptyMessage}</div>
                        ) : (
                            filteredOptions.map((option) => {
                                const selectedOption = option.value === value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setQuery("");
                                            setOpen(false);
                                        }}
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-surface focus:bg-surface focus:outline-none"
                                        role="option"
                                        aria-selected={selectedOption}
                                    >
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-ink">{option.label}</span>
                                            {option.description && <span className="block truncate text-xs text-slate">{option.description}</span>}
                                        </span>
                                        {selectedOption && <Check className="h-4 w-4 shrink-0 text-primary-brand" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

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
                searchText: `${customer.name} ${customer.email}`,
            })),
        [customers]
    );
    const serviceOptions = useMemo(
        () =>
            services.map((service) => ({
                value: service.id,
                label: service.name,
                description: `${service.category} - ${service.type}`,
                searchText: service.name,
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
                                <SearchablePicker
                                    value={form.customerId}
                                    onChange={set("customerId")}
                                    options={customerOptions}
                                    placeholder="Select a customer"
                                    searchPlaceholder="Search by name or email..."
                                    emptyMessage="No customers found"
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
                                            <SearchablePicker
                                                value={item.serviceId}
                                                onChange={(value) => setItem(item.id, "serviceId", value)}
                                                options={serviceOptions}
                                                placeholder={`Select service ${index + 1}`}
                                                searchPlaceholder="Search by service name..."
                                                emptyMessage="No services found"
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
