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
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50/40 via-white to-rose-50/30">
            {/* Decorative blobs */}
            <div className="pointer-events-none fixed -top-24 -right-24 h-72 w-72 rounded-full bg-red-100/40 blur-3xl" />
            <div className="pointer-events-none fixed -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose-100/30 blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="rounded-3xl border border-red-100 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />

                    <div className="px-8 pt-10 pb-8 text-center space-y-5">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-500" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Your payment could not be processed. No amount has been charged. Please try again or contact support if the issue persists.
                            </p>
                        </div>

                        {/* Error note */}
                        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-medium px-4 py-2 rounded-full">
                            <XCircle className="h-3.5 w-3.5" />
                            Transaction declined by payment gateway
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href={retryHref}
                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium bg-[#FF9933] text-white hover:bg-[#FF9933]/90 rounded-xl transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Link>
                            <Link
                                href="/customer"
                                className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </div>

                        {/* Support link */}
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            Need help?{" "}
                            <Link href="/customer/services" className="text-[#FF9933] underline underline-offset-2 hover:text-[#FF9933]/80">
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading…</div>}>
            <FailureContent />
        </Suspense>
    );
}
