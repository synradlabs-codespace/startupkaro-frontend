"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { mockServices } from "@/lib/mock-data";
import { ShieldCheck, CreditCard, ArrowLeft, Clock, Tag, Receipt } from "lucide-react";
import Link from "next/link";

type RazorpayInstance = {
    on: (event: "payment.failed", handler: () => void) => void;
    open: () => void;
};

type RazorpayWindow = Window & {
    Razorpay: new (options: unknown) => RazorpayInstance;
};

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get("service") ?? "SVC-001";
    const service = mockServices.find((s) => s.id === serviceId) ?? mockServices[0];

    const handlePayment = () => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: service.price * 100, // paise
                currency: "INR",
                name: "StartupKaro",
                description: service.name,
                image: "/startupkaro-logo.svg",
                handler: function (response: { razorpay_payment_id: string }) {
                    router.push(
                        `/customer/checkout/success?payment_id=${response.razorpay_payment_id}&service=${serviceId}`
                    );
                },
                modal: {
                    ondismiss: function () {
                        router.push(`/customer/checkout/failure?service=${serviceId}`);
                    },
                },
                theme: { color: "#296ef9" },
            };

            const rzp = new (window as unknown as RazorpayWindow).Razorpay(options);
            rzp.on("payment.failed", function () {
                router.push(`/customer/checkout/failure?service=${serviceId}`);
            });
            rzp.open();
        };

        script.onerror = () => {
            router.push(`/customer/checkout/failure?service=${serviceId}`);
        };
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

                {/* ── Order Summary ───────────────────────── */}
                <div className="md:col-span-2 rounded-lg border border-hairline bg-canvas overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-hairline flex items-center gap-3">
                        <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <Receipt className="h-3.5 w-3.5 text-charcoal" />
                        </div>
                        <h3 className="text-sm font-semibold text-charcoal">Order Summary</h3>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                        {[
                            { label: "Service", value: service.name, icon: Tag },
                            { label: "Processing Time", value: service.duration, icon: Clock },
                        ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
                                <span className="text-sm text-steel flex items-center gap-2">
                                    <Icon className="h-3.5 w-3.5 text-stone" />
                                    {label}
                                </span>
                                <span className="text-sm font-medium text-charcoal">{value}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between py-3 border-b border-hairline">
                            <span className="text-sm text-steel">Subtotal</span>
                            <span className="text-sm font-medium">₹{service.price.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-base font-semibold text-ink">Total</span>
                            <span className="text-xl font-bold text-charcoal">₹{service.price.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                    <div className="px-6 pb-5">
                        <div className="flex items-center gap-2 text-xs text-stone bg-surface rounded-lg px-3 py-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-charcoal shrink-0" />
                            Payments are secured and processed by Razorpay
                        </div>
                    </div>
                </div>

                {/* ── Pay Now ─────────────────────────────── */}
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden flex flex-col">
                    <div className="h-1.5 bg-gradient-to-r from-primary-brand to-accent-customer" />
                    <div className="p-6 flex flex-col flex-1 space-y-5">
                        <div>
                            <p className="text-xs text-stone uppercase tracking-wide font-medium mb-1">Amount Due</p>
                            <p className="text-3xl font-bold text-ink">₹{service.price.toLocaleString("en-IN")}</p>
                        </div>

                        <div className="h-px bg-surface" />

                        <div className="flex-1 space-y-3">
                            <p className="text-xs text-steel font-medium">You will be redirected to Razorpay to complete payment securely.</p>
                            <ul className="space-y-1.5 text-xs text-stone">
                                {["UPI, Cards, Net Banking accepted", "256-bit SSL encryption", "Instant payment confirmation"].map((t) => (
                                    <li key={t} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary-brand/50 shrink-0" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={handlePayment}
                            className="w-full gap-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg"
                        >
                            <CreditCard className="h-4 w-4" />
                            Pay with Razorpay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomerCheckoutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Checkout"
                description="Review your order before payment"
                action={
                    <Link href="/customer/services" className="inline-flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-steel hover:text-charcoal hover:bg-surface rounded-lg transition-colors">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                    </Link>
                }
            />
            <Suspense fallback={
                <div className="p-6 text-sm text-stone">Loading checkout…</div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
