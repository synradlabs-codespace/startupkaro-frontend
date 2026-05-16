"use client";

// features/customers/components/CustomerPurchaseDetailPage.tsx

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/custom/StatusBadge";
import { mockPurchases } from "@/lib/mock-data";
import { CreditCard, Download, Mail, Phone } from "lucide-react";

type RazorpayInstance = {
    on: (event: "payment.failed", handler: () => void) => void;
    open: () => void;
};

type RazorpayWindow = Window & {
    Razorpay: new (options: unknown) => RazorpayInstance;
};

export function CustomerPurchaseDetailPage({ id }: { id: string }) {
    const purchase = mockPurchases.find((p) => p.id === id) ?? mockPurchases[0];
    const router = useRouter();
    const isPendingPayment = purchase.paymentStatus === "pending";

    const handlePayNow = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: purchase.amount * 100, // paise
                currency: "INR",
                name: "StartupKaro",
                description: purchase.service,
                image: "/startupkaro-logo.svg",
                handler: function (response: { razorpay_payment_id: string }) {
                    router.push(
                        `/customer/checkout/success?payment_id=${response.razorpay_payment_id}`
                    );
                },
                modal: {
                    ondismiss: function () {
                        router.push("/customer/checkout/failure");
                    },
                },
                theme: { color: "#296ef9" },
            };

            const rzp = new (window as unknown as RazorpayWindow).Razorpay(options);
            rzp.on("payment.failed", function () {
                router.push("/customer/checkout/failure");
            });
            rzp.open();
        };

        script.onerror = () => {
            router.push("/customer/checkout/failure");
        };
    };

    return (
        <div>
            <PageHeader
                title={purchase.service}
                description={`Purchase ${purchase.id}`}
                action={
                    <div className="flex items-center gap-2">
                        {isPendingPayment && (
                            <Button
                                size="sm"
                                onClick={handlePayNow}
                                className="bg-primary-brand hover:bg-primary-brand/90 text-white"
                            >
                                <CreditCard className="h-4 w-4 mr-1" /> Pay Now
                            </Button>
                        )}
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" /> Download Invoice
                        </Button>
                    </div>
                }
            />
            <div className="p-6 max-w-lg space-y-4">
                <Card>
                    <CardHeader><CardTitle className="text-base">Purchase Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {[
                            { label: "Purchase ID", value: purchase.id, mono: true },
                            { label: "Service", value: purchase.service },
                            { label: "Amount Paid", value: `₹${purchase.amount.toLocaleString("en-IN")}` },
                            { label: "Date", value: purchase.date },
                        ].map(({ label, value, mono }) => (
                            <div key={label} className="flex justify-between">
                                <span className="text-slate">{label}</span>
                                <span className={mono ? "font-mono text-xs" : "font-medium"}>{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <span className="text-slate">Service Status</span>
                            <OrderStatusBadge status={purchase.status} />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate">Payment</span>
                            <PaymentStatusBadge status={purchase.paymentStatus} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Next Steps</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate">
                        <p>
                            StartupKaro will coordinate required documents through our official email. There is no document upload step inside the customer dashboard.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1">
                                <Mail className="h-3 w-3" />
                                Email checklist
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface px-2.5 py-1">
                                <Phone className="h-3 w-3" />
                                Expert call updates
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

