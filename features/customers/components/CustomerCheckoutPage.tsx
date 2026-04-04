"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockServices } from "@/lib/mock-data";
import { ShieldCheck, CreditCard } from "lucide-react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceId = searchParams.get("service") ?? "SVC-001";
    const service = mockServices.find((s) => s.id === serviceId) ?? mockServices[0];

    const handlePayment = () => {
        // TODO: init Razorpay when backend is ready
        router.push("/customer/checkout/success");
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <Card className="md:col-span-2">
                <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{service.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Processing Time</span>
                        <span className="font-medium">{service.duration}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{service.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between py-2 font-semibold text-base">
                        <span>Total</span>
                        <span>₹{service.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <ShieldCheck className="h-4 w-4 text-[var(--color-green)]" />
                        Payments are secured by Razorpay
                    </div>
                </CardContent>
            </Card>

            <Card className="h-fit">
                <CardHeader><CardTitle className="text-base">Pay Now</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-2xl font-bold">₹{service.price.toLocaleString("en-IN")}</p>
                    <Button
                        onClick={handlePayment}
                        className="w-full bg-[var(--color-green)] hover:bg-[var(--color-green)]/90 text-white"
                    >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay with Razorpay
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        You will be redirected to Razorpay to complete your payment securely.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export function CustomerCheckoutPage() {
    return (
        <div>
            <PageHeader title="Checkout" description="Review your order before payment" />
            <Suspense fallback={
                <div className="p-6 text-sm text-muted-foreground">Loading checkout...</div>
            }>
                <CheckoutContent />
            </Suspense>
        </div>
    );
}