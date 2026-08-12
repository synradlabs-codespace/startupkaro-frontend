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
        mutationFn: async ({ initiation }: { initiation: RawPaymentInitiation; options?: StartPaymentOptions }) => {
            const normalized = normalizePaymentInitiation(initiation);
            await loadRazorpayScript();
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
        },
        onSuccess: () => invalidate(),
        onError: (error) => {
            if (error instanceof RazorpayCheckoutError) {
                if (error.reason === "dismissed") {
                    toast.error({
                        title: "Payment not completed",
                        description: "Your cart is still saved. You can retry from Cart or My Purchases.",
                    });
                } else {
                    toast.error({
                        title: "Payment failed",
                        description: error.description || "The payment gateway declined this transaction.",
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
