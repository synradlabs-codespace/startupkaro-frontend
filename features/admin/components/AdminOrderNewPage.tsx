// features/admin/components/AdminOrderNewPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCustomers } from "@/lib/mock-data";
import { ShoppingBag, User, Briefcase, IndianRupee, ClipboardList, StickyNote } from "lucide-react";

const services = [
    "GST Registration",
    "Company Incorporation",
    "Trademark Filing",
    "Income Tax Filing",
    "FSSAI License",
    "Import Export Code",
    "ISO Certification",
];

export function AdminOrderNewPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        customerId: "",
        service: "",
        amount: "",
        status: "pending",
        notes: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/admin/orders");
    };

    const set = (key: keyof typeof form) => (value: string | null) => {
        setForm((f) => ({ ...f, [key]: value ?? "" }));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="New Order" description="Create a new order for a customer" />

            <div className="flex-1 p-6 max-w-2xl space-y-6">

                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-lg border border-hairline bg-accent-admin p-8">
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary-brand/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-green-300/10 blur-2xl" />
                    <div className="relative flex flex-col items-center text-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent-admin to-accent-admin border-2 border-hairline flex items-center justify-center ">
                            <ShoppingBag className="h-7 w-7 text-charcoal" />
                        </div>
                        <div>
                            <p className="font-semibold text-ink text-base">New Order</p>
                            <p className="text-xs text-steel mt-0.5">Assign a service to a customer and set the payment details</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <ClipboardList className="h-3.5 w-3.5 text-charcoal" />
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
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockCustomers.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <Briefcase className="h-3 w-3" /> Service
                                </Label>
                                <Select value={form.service} onValueChange={set("service")}>
                                    <SelectTrigger className="rounded-lg border-hairline focus:ring-primary-brand/20">
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                    <IndianRupee className="h-3 w-3" /> Amount (₹)
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="1499"
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
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
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

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                className="bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg gap-2"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                Create Order
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/orders")}
                                className="rounded-lg"
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
