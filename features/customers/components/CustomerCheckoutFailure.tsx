"use client";

// features/customers/components/CustomerCheckoutFailure.tsx

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, LayoutDashboard, Phone } from "lucide-react";

function FailureContent() {
    const searchParams = useSearchParams();
    const serviceId = searchParams.get("service");
    const retryHref = serviceId
        ? `/customer/checkout?service=${serviceId}`
        : "/customer/services";

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
                                Your payment could not be processed. No amount has been charged. Please try again or contact support if the issue persists.
                            </p>
                        </div>

                        {/* Error note */}
                        <div className="inline-flex items-center gap-2 bg-error-brand/10 border border-error-brand/20 text-error-brand text-xs font-medium px-4 py-2 rounded-full">
                            <XCircle className="h-3.5 w-3.5" />
                            Transaction declined by payment gateway
                        </div>

                        <div className="h-px bg-surface" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={retryHref}
                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium bg-primary-brand text-white hover:bg-primary-brand/90 rounded-md transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Link>
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
                            <Link href="/customer/services" className="text-charcoal underline underline-offset-2 hover:text-charcoal/80">
                                Contact support
                            </Link>
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
