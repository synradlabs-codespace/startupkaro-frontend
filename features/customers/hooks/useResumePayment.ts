// features/customers/hooks/useResumePayment.ts
//
// Single entry point for opening/re-opening a Razorpay checkout. Cart
// checkout, service checkout, the purchases table, the purchase detail page,
// and the dashboard all funnel through this hook so a modal dismiss, a
// gateway decline, and a successful payment are handled the same way
// everywhere.

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/providers/ToastProvider";
import { customerPurchaseService, type CustomerPurchase } from "@/services/customer.service";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { getApiErrorMessage, isRateLimited } from "@/features/customers/lib/format";
import { getPurchaseAmountDue, getResumablePaymentId, normalizePaymentInitiation, type RawPaymentInitiation } from "@/features/customers/lib/payment";
import { loadRazorpayScript, openRazorpayCheckout, RazorpayCheckoutError } from "@/lib/razorpay";

type StartPaymentOptions = {
    serviceName?: string;
    /** Only true for a checkout that just created a fresh draft (cart / service
     * checkout). If the customer dismisses the modal, the draft is discarded
     * server-side so it never lingers as a phantom pending order. Never set
     * this for a resumed payment - that order is already promoted, and
     * abandoning it would just get rejected (409). */
    abandonOnDismiss?: boolean;
};

export function useResumePayment() {
    const queryClient = useQueryClient();
    const toast = useToast();
    const profileQuery = useCustomerProfile();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["customer", "purchases"] });
        queryClient.invalidateQueries({ queryKey: ["customer", "cart"] });
    };

    const startPayment = useMutation({
        mutationFn: async ({ initiation, options }: { initiation: RawPaymentInitiation; options?: StartPaymentOptions }) => {
            const normalized = normalizePaymentInitiation(initiation);
            await loadRazorpayScript();
            try {
                const response = await openRazorpayCheckout({
                    key: normalized.razorpayKeyId,
                    amount: normalized.amount,
                    currency: normalized.currency,
                    name: "StartupKaro",
                    description: normalized.description ?? normalized.serviceName,
                    order_id: normalized.razorpayOrderId,
                    prefill: {
                        name: profileQuery.data?.name,
                        email: profileQuery.data?.email,
                        contact: profileQuery.data?.phone ?? profileQuery.data?.mobile,
                    },
                    theme: { color: "#296ef9" },
                });
                const verification = await customerPurchaseService.verify(response);
                return { normalized, response, orderId: verification.data.data.orderId };
            } catch (error) {
                if (error instanceof RazorpayCheckoutError && error.reason === "dismissed" && options?.abandonOnDismiss && normalized.orderId) {
                    // Best-effort: discards the draft this checkout just created so it
                    // never lingers as a phantom pending order. Every outcome (200
                    // discarded, 409 already promoted, 503 gateway unreachable) is
                    // safe to ignore here - the sweeper is the real guarantee.
                    void customerPurchaseService.abandon(normalized.orderId).catch(() => {});
                }
                throw error;
            }
        },
        onSuccess: () => invalidate(),
        onError: (error) => {
            if (error instanceof RazorpayCheckoutError) {
                if (error.reason === "dismissed") {
                    toast.error({
                        title: "Checkout cancelled",
                        description: "Nothing was ordered. Your cart is saved if you want to come back.",
                    });
                } else {
                    toast.error({
                        title: "Payment failed",
                        description: error.description || "Your bank declined this transaction. You can try again.",
                    });
                }
                invalidate();
                return;
            }

            if (isRateLimited(error)) {
                toast.error({
                    title: "Too many attempts",
                    description: "You've reached the maximum number of payment attempts. Please contact support.",
                });
                return;
            }

            toast.error({ title: "Payment could not be completed", description: getApiErrorMessage(error, "Please try again.") });
            invalidate();
        },
    });

    const resumePayment = useMutation({
        mutationFn: async (purchase: CustomerPurchase) => {
            const paymentId = getResumablePaymentId(purchase);
            const initiation = paymentId
                ? (await customerPurchaseService.retryPayment(paymentId)).data.data
                : (await customerPurchaseService.payBalance(purchase.id, { amount: getPurchaseAmountDue(purchase) })).data.data;
            return startPayment.mutateAsync({ initiation, options: { serviceName: purchase.service?.name } });
        },
        onError: (error) => {
            // startPayment's own onError already handled RazorpayCheckoutError/429;
            // this catches failures from the retry/pay-balance call itself (409s).
            if (error instanceof RazorpayCheckoutError || isRateLimited(error)) return;
            toast.error({ title: "Could not resume payment", description: getApiErrorMessage(error, "Please try again.") });
            invalidate();
        },
    });

    return {
        startPayment: (initiation: RawPaymentInitiation, options?: StartPaymentOptions) => startPayment.mutateAsync({ initiation, options }),
        resumePayment: (purchase: CustomerPurchase) => resumePayment.mutateAsync(purchase),
        isPending: startPayment.isPending || resumePayment.isPending,
    };
}
