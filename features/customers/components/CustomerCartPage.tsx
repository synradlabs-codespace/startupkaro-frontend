"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, CreditCard, ArrowLeft, X } from "lucide-react";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCheckoutCustomerCart, useClearCustomerCart, useCustomerCart, useRemoveCartItem, useUpdateCartItem } from "@/features/customers/hooks/useCustomerCart";
import { useResumePayment } from "@/features/customers/hooks/useResumePayment";
import { normalizePaymentInitiation } from "@/features/customers/lib/payment";
import { formatINR } from "@/lib/currency";
import { RazorpayCheckoutError } from "@/lib/razorpay";
import type { CustomerCartItem } from "@/services/customer.service";

function itemName(item: CustomerCartItem) {
    return item.name ?? item.service?.name ?? item.serviceId;
}

function itemUnitPrice(item: CustomerCartItem) {
    return item.unitPrice ?? item.price ?? item.service?.price ?? 0;
}

function itemTotal(item: CustomerCartItem) {
    return item.amount ?? item.taxableValue ?? itemUnitPrice(item) * item.quantity;
}

export function CustomerCartPage() {
    const router = useRouter();
    const cartQuery = useCustomerCart();
    const updateItem = useUpdateCartItem();
    const removeItem = useRemoveCartItem();
    const clearCart = useClearCustomerCart();
    const checkoutCart = useCheckoutCustomerCart();
    const { startPayment, isPending: isPaying } = useResumePayment();
    const cart = cartQuery.data;
    const items = cart?.items ?? [];
    const summary = cart?.summary;
    const isCheckingOut = checkoutCart.isPending || isPaying;

    const handleCheckout = async () => {
        let normalized: ReturnType<typeof normalizePaymentInitiation> | undefined;
        try {
            const initiation = (await checkoutCart.mutateAsync()).data.data;
            normalized = normalizePaymentInitiation(initiation);
            const { response, orderId } = await startPayment(initiation);
            router.push(`/customer/checkout/success?payment_id=${response.razorpay_payment_id}&order_id=${orderId}`);
        } catch (error) {
            // A dismissed checkout is handled (toast + stay put) inside
            // useResumePayment - only a genuine gateway decline routes away,
            // carrying the order/payment id so "Try Again" retries the same
            // payment instead of starting a brand new order.
            if (error instanceof RazorpayCheckoutError && error.reason === "failed") {
                const params = new URLSearchParams({ message: error.description || "Transaction declined by payment gateway" });
                if (normalized?.orderId) params.set("order", normalized.orderId);
                if (normalized?.paymentId) params.set("payment", normalized.paymentId);
                router.push(`/customer/checkout/failure?${params.toString()}`);
            }
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <PageHeader
                title="Cart"
                description={`${summary?.itemCount ?? items.length} item${(summary?.itemCount ?? items.length) === 1 ? "" : "s"}`}
                action={
                    <Link href="/customer/services" className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-steel transition-colors hover:bg-surface hover:text-charcoal">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Services
                    </Link>
                }
            />
            <div className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
                <Card className="overflow-hidden">
                    <CardContent className="space-y-3 pt-6">
                        {cartQuery.isLoading ? (
                            <p className="text-sm text-slate">Loading cart...</p>
                        ) : cartQuery.isError ? (
                            <p className="text-sm text-error-brand">Failed to load cart</p>
                        ) : items.length === 0 ? (
                            <div className="rounded-lg border border-hairline bg-surface p-8 text-center">
                                <p className="text-sm font-medium text-ink">Your cart is empty.</p>
                                <Link href="/customer/services" className="mt-3 inline-flex h-9 items-center rounded-md bg-primary-brand px-4 text-sm font-medium text-white">
                                    Browse Services
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="grid gap-3 rounded-lg border border-hairline bg-canvas p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                                    <div>
                                        <p className="font-medium text-charcoal">{itemName(item)}</p>
                                        <p className="mt-1 text-xs text-slate">{formatINR(itemUnitPrice(item))} each</p>
                                    </div>
                                    <div className="flex h-9 w-fit items-center rounded-md border border-hairline bg-surface">
                                        <button
                                            type="button"
                                            className="flex h-9 w-9 items-center justify-center text-slate hover:text-ink"
                                            onClick={() => updateItem.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                                            disabled={item.quantity <= 1 || updateItem.isPending}
                                            title="Decrease quantity"
                                        >
                                            <Minus className="h-3.5 w-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium text-ink">{item.quantity}</span>
                                        <button
                                            type="button"
                                            className="flex h-9 w-9 items-center justify-center text-slate hover:text-ink"
                                            onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                                            disabled={updateItem.isPending}
                                            title="Increase quantity"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <span className="font-medium text-ink">{formatINR(itemTotal(item))}</span>
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 border border-hairline-strong text-slate hover:border-error-brand hover:bg-error-brand/10 hover:text-error-brand"
                                                        onClick={() => removeItem.mutate(item.id)}
                                                        disabled={removeItem.isPending}
                                                        aria-label="Remove item"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                            <TooltipContent>Remove</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="h-fit overflow-hidden">
                    <div className="-mt-1 h-1.5 bg-primary-brand" />
                    <CardHeader>
                        <CardTitle className="text-base">Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-slate">Subtotal</span><span className="font-medium">{formatINR(summary?.subtotal ?? 0)}</span></div>
                            <div className="flex justify-between"><span className="text-slate">GST</span><span className="font-medium">{formatINR(summary?.tax ?? 0)}</span></div>
                            <div className="flex justify-between border-t border-hairline pt-3 text-base"><span className="font-semibold text-ink">Total</span><span className="font-display font-medium text-ink">{formatINR(summary?.total ?? 0)}</span></div>
                        </div>
                        {items.length > 0 && (
                            <p className="rounded-md bg-surface px-3 py-2 text-xs leading-relaxed text-slate">
                                Government fees or statutory charges, if applicable for any service, are not included above and are billed separately.
                            </p>
                        )}
                        <Button
                            className="w-full gap-2 bg-primary-brand text-white hover:bg-primary-brand/90 uppercase tracking-wide"
                            disabled={items.length === 0 || summary?.checkoutBlocked || isCheckingOut}
                            onClick={handleCheckout}
                        >
                            <CreditCard className="h-4 w-4" />
                            {isCheckingOut ? "Processing..." : "Checkout"}
                        </Button>
                        {items.length > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-2 uppercase tracking-wide"
                                onClick={() => clearCart.mutate()}
                                disabled={clearCart.isPending}
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear Cart
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
