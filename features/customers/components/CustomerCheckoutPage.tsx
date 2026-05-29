"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { useCustomerServiceList } from "@/features/customers/hooks/useCustomerServices";
import { useInitiateCustomerPurchase, useVerifyCustomerPurchase } from "@/features/customers/hooks/useCustomerPurchases";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { getApiErrorMessage } from "@/features/customers/lib/format";
import { formatINR } from "@/lib/currency";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay";
import { ShieldCheck, CreditCard, ArrowLeft, Clock, Tag, Receipt } from "lucide-react";
import Link from "next/link";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceParam = searchParams.get("service") ?? "";
    const servicesQuery = useCustomerServiceList({ page: 1, limit: 100 });
    const initiatePurchase = useInitiateCustomerPurchase();
    const verifyPurchase = useVerifyCustomerPurchase();
    const profileQuery = useCustomerProfile();
    const profile = profileQuery.data;
    const [error, setError] = useState("");
    const service = (servicesQuery.data?.data ?? []).find((item) => item.id === serviceParam || item.slug === serviceParam);

    const handlePayment = async () => {
        if (!service) return;
        setError("");

        try {
            const initiation = (await initiatePurchase.mutateAsync({ serviceId: service.id || service.slug })).data.data;
            await loadRazorpayScript();
            const response = await openRazorpayCheckout({
                key: initiation.razorpayKeyId,
                amount: initiation.amount,
                currency: initiation.currency,
                name: "StartupKaro",
                description: initiation.serviceName,
                order_id: initiation.razorpayOrderId,
                prefill: {
                    name: profile?.name,
                    email: profile?.email,
                    contact: profile?.phone ?? profile?.mobile,
                },
                theme: { color: "#296ef9" },
            });
            const verification = (await verifyPurchase.mutateAsync(response)).data.data;
            router.push(`/customer/checkout/success?payment_id=${response.razorpay_payment_id}&order_id=${verification.orderId}`);
        } catch (err: unknown) {
            const message = getApiErrorMessage(err, "Payment could not be completed");
            setError(message);
            router.push(`/customer/checkout/failure?service=${serviceParam}`);
        }
    };

    if (servicesQuery.isLoading) {
        return <div className="p-6 text-sm text-stone">Loading checkout...</div>;
    }

    if (servicesQuery.isError || !service) {
        return <div className="p-6 text-sm text-error-brand">Failed to load selected service</div>;
    }

    const isPaying = initiatePurchase.isPending || verifyPurchase.isPending;

    if (isPaying) {
        return (
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {/* Left skeleton — order summary */}
                    <div className="md:col-span-2 rounded-lg border border-hairline bg-canvas overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-hairline flex items-center gap-3">
                            <div className="h-7 w-7 rounded-lg bg-hairline animate-pulse" />
                            <div className="h-4 w-32 rounded bg-hairline animate-pulse" />
                        </div>
                        <div className="p-6 flex-1 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
                                    <div className="h-3.5 w-24 rounded bg-hairline animate-pulse" />
                                    <div className="h-3.5 w-32 rounded bg-hairline animate-pulse" />
                                </div>
                            ))}
                            <div className="flex items-center justify-between pt-2">
                                <div className="h-4 w-16 rounded bg-hairline animate-pulse" />
                                <div className="h-6 w-24 rounded bg-hairline animate-pulse" />
                            </div>
                        </div>
                        <div className="px-6 pb-5">
                            <div className="h-8 w-full rounded-lg bg-hairline animate-pulse" />
                        </div>
                    </div>

                    {/* Right skeleton — payment panel */}
                    <div className="rounded-lg border border-hairline bg-canvas overflow-hidden flex flex-col">
                        <div className="h-1.5 bg-primary-brand/30 animate-pulse" />
                        <div className="p-6 flex flex-col flex-1 space-y-5">
                            <div className="space-y-2">
                                <div className="h-3 w-20 rounded bg-hairline animate-pulse" />
                                <div className="h-8 w-28 rounded bg-hairline animate-pulse" />
                            </div>
                            <div className="h-px bg-surface" />
                            <div className="flex-1 space-y-3">
                                <div className="h-3.5 w-full rounded bg-hairline animate-pulse" />
                                <div className="h-3.5 w-4/5 rounded bg-hairline animate-pulse" />
                                <div className="h-3.5 w-3/5 rounded bg-hairline animate-pulse" />
                            </div>
                            <div className="h-10 w-full rounded-lg bg-primary-brand/20 animate-pulse" />
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs text-stone animate-pulse">
                    Verifying your payment, please wait…
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
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
                            <span className="text-sm font-medium">{formatINR(service.price)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-base font-semibold text-ink">Total</span>
                            <span className="text-xl font-display font-medium text-charcoal">{formatINR(service.price)}</span>
                        </div>
                    </div>
                    <div className="px-6 pb-5">
                        <div className="flex items-center gap-2 text-xs text-stone bg-surface rounded-lg px-3 py-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-charcoal shrink-0" />
                            Payments are secured and processed by Razorpay
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden flex flex-col">
                    <div className="h-1.5 bg-primary-brand" />
                    <div className="p-6 flex flex-col flex-1 space-y-5">
                        <div>
                            <p className="text-xs text-stone uppercase tracking-wide font-medium mb-1">Amount Due</p>
                            <p className="text-3xl font-bold text-ink">{formatINR(service.price)}</p>
                        </div>

                        <div className="h-px bg-surface" />

                        <div className="flex-1 space-y-3">
                            <p className="text-xs text-steel font-medium">You will be redirected to Razorpay to complete payment securely.</p>
                            <ul className="space-y-1.5 text-xs text-stone">
                                {["UPI, Cards, Net Banking accepted", "256-bit SSL encryption", "Instant payment confirmation"].map((text) => (
                                    <li key={text} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary-brand/50 shrink-0" />
                                        {text}
                                    </li>
                                ))}
                            </ul>
                            {error && <p className="text-xs text-error-brand">{error}</p>}
                        </div>

                        <Button
                            onClick={handlePayment}
                            disabled={isPaying}
                            className="w-full gap-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg uppercase tracking-wide"
                        >
                            <CreditCard className="h-4 w-4" />
                            {isPaying ? "Processing..." : "Pay with Razorpay"}
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
                <div className="p-6 text-sm text-stone">Loading checkout...</div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}
