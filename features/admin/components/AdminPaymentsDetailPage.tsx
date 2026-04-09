// features/admin/components/AdminPaymentsDetailPage.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockPayments } from "@/lib/mock-data";
import { CheckCircle2, CreditCard, Hash, User, IndianRupee, Smartphone, Calendar, ShieldCheck } from "lucide-react";

export function AdminPaymentDetailPage({ id }: { id: string }) {
    const payment = mockPayments.find((p) => p.id === id) ?? mockPayments[0];
    const [status, setStatus] = useState(payment.status);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const statusChanged = status !== payment.status;

    const details = [
        { label: "Payment ID", value: payment.id, icon: Hash, mono: true },
        { label: "Order ID", value: payment.orderId, icon: CreditCard, mono: true },
        { label: "Customer", value: payment.customer, icon: User },
        { label: "Amount", value: `₹${payment.amount.toLocaleString("en-IN")}`, icon: IndianRupee },
        { label: "Method", value: payment.method, icon: Smartphone },
        { label: "Date", value: payment.date, icon: Calendar },
    ] as const;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title={`Payment ${payment.id}`} />

            <div className="flex-1 p-6 max-w-4xl">
                <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                    {/* Header strip */}
                    <div className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-[var(--color-green)]/8 to-green-50/60 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-green)]/20 to-green-200/40 border border-[var(--color-green)]/20 flex items-center justify-center shrink-0">
                            <CreditCard className="h-5 w-5 text-[var(--color-green)]" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{payment.customer}</p>
                            <p className="text-xl font-bold text-[var(--color-green)]">₹{payment.amount.toLocaleString("en-IN")}</p>
                        </div>
                        <p className="ml-auto font-mono text-xs text-gray-400">{payment.id}</p>
                    </div>

                    {/* Two-column body */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Left — details */}
                        <div className="p-6 space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="h-6 w-6 rounded-md bg-[var(--color-green)]/10 flex items-center justify-center">
                                    <CreditCard className="h-3 w-3 text-[var(--color-green)]" />
                                </div>
                                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Payment Details</h3>
                            </div>
                            {details.map(({ label, value, icon: Icon, mono }) => (
                                <div key={label} className="flex items-center gap-3 py-1.5">
                                    <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    <span className="text-xs text-gray-500 w-20 shrink-0">{label}</span>
                                    <span className={`text-sm ml-auto ${mono ? "font-mono text-xs text-gray-600" : "font-medium text-gray-800"}`}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Right — status */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="h-6 w-6 rounded-md bg-[var(--color-green)]/10 flex items-center justify-center">
                                    <ShieldCheck className="h-3 w-3 text-[var(--color-green)]" />
                                </div>
                                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Payment Status</h3>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs text-muted-foreground">Update Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="rounded-xl border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                        <SelectItem value="partial">Partial</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>

                                {(statusChanged || saved) && (
                                    <Button
                                        size="sm"
                                        className="w-full bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white rounded-xl"
                                        onClick={handleSave}
                                        disabled={saved}
                                    >
                                        {saved ? (
                                            <><CheckCircle2 className="h-4 w-4 mr-1.5" /> Saved</>
                                        ) : (
                                            "Save Status"
                                        )}
                                    </Button>
                                )}

                                <Link href={`/admin/orders/${payment.orderId}`}>
                                    <Button variant="outline" size="sm" className="w-full rounded-xl mt-1">
                                        View Associated Order →
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
