"use client";

// features/customers/components/CustomerCheckoutSuccess.tsx

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, LayoutDashboard, Sparkles } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-accent-customer">
            <div className="w-full max-w-md">
                <div className="rounded-lg border border-hairline bg-canvas overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-primary-brand" />

                    <div className="px-8 pt-10 pb-8 text-center space-y-5">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-tint-sky flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-primary-brand" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-display font-medium text-ink">Payment Successful!</h1>
                            <p className="text-sm text-steel leading-relaxed">
                                Your order has been placed. Our team will email you the required document checklist and assign an expert to your case.
                            </p>
                        </div>

                        {/* Info pill */}
                        <div className="inline-flex items-center gap-2 bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-medium px-4 py-2 rounded-full">
                            <Sparkles className="h-3.5 w-3.5" />
                            Updates will be shared by email and expert call
                        </div>

                        {paymentId && (
                            <p className="text-xs text-stone font-mono">
                                Payment ID: {paymentId}
                            </p>
                        )}

                        <div className="h-px bg-surface" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/customer/purchases"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-md transition-colors"
                            >
                                <ShoppingBag className="h-4 w-4" />
                                My Purchases
                            </Link>
                            <Link
                                href="/customer"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-md transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomerCheckoutSuccess() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-stone">Loading…</div>}>
            <SuccessContent />
        </Suspense>
    );
}
