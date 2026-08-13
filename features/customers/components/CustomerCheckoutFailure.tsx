"use client";

// features/customers/components/CustomerCheckoutFailure.tsx

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, LayoutDashboard, Phone, Loader2 } from "lucide-react";
import { useCustomerPurchase } from "@/features/customers/hooks/useCustomerPurchases";
import { useResumePayment } from "@/features/customers/hooks/useResumePayment";
import { RazorpayCheckoutError } from "@/lib/razorpay";
import { WHATSAPP_URL } from "@/components/custom/WhatsAppButton";

function FailureContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceId = searchParams.get("service");
    const orderId = searchParams.get("order");
    const [retrying, setRetrying] = useState(false);

    // Only fetched when we have an order id to retry against. A declined
    // card's order is promoted from draft to a real, fetchable order by an
    // async Razorpay webhook, so this page can beat that webhook here -
    // pollForPromotion rides out the race instead of failing once.
    const purchaseQuery = useCustomerPurchase(orderId ?? "", { pollForPromotion: true });
    const { resumePayment } = useResumePayment();

    const retryHref = serviceId ? `/customer/checkout?service=${serviceId}` : "/customer/services";
    // Falls back to starting a brand new checkout if there's no order to
    // retry against, or the order never showed up (webhook never landed).
    const canRetryOrder = Boolean(orderId) && !purchaseQuery.isError;
    const preparingRetry = canRetryOrder && purchaseQuery.isLoading;

    const handleTryAgain = async () => {
        if (!purchaseQuery.data) return;
        setRetrying(true);
        try {
            const { orderId: verifiedOrderId } = await resumePayment(purchaseQuery.data);
            router.push(`/customer/checkout/success?order_id=${verifiedOrderId}`);
        } catch (error) {
            if (!(error instanceof RazorpayCheckoutError)) {
                router.push("/customer/purchases");
            }
        } finally {
            setRetrying(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-accent-customer">
            <div className="w-full max-w-md">
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-error-brand" />

                    <div className="px-8 pt-10 pb-8 text-center space-y-5">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-error-brand/10 flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-error-brand" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-display font-medium text-ink">Payment Failed</h1>
                            <p className="text-sm text-steel leading-relaxed">
                                Your bank or payment gateway declined this transaction, so it could not be completed. No amount has been deducted from your account.
                            </p>
                        </div>

                        <div className="h-px bg-surface" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {canRetryOrder ? (
                                <button
                                    type="button"
                                    onClick={handleTryAgain}
                                    disabled={retrying || preparingRetry}
                                    className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-md transition-colors disabled:opacity-60"
                                >
                                    {retrying || preparingRetry ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                    {retrying ? "Retrying..." : preparingRetry ? "Preparing..." : "Try Again"}
                                </button>
                            ) : (
                                <Link
                                    href={retryHref}
                                    className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-md transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </Link>
                            )}
                            <Link
                                href="/customer"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-md transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </div>

                        {/* Support link */}
                        <p className="text-xs text-stone flex items-center justify-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            Need help?{" "}
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-charcoal underline underline-offset-2 hover:text-charcoal/80"
                            >
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomerCheckoutFailure() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-stone">Loading…</div>}>
            <FailureContent />
        </Suspense>
    );
}
