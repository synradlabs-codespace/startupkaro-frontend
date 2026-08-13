import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerPurchaseService, normalizeList } from "@/services/customer.service";
import type { RazorpayHandlerResponse } from "@/lib/razorpay";

export function useCustomerPurchaseList(params: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["customer", "purchases", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => {
            const response = await customerPurchaseService.list(params);
            return normalizeList(response.data, params.page ?? 1, params.limit ?? 10);
        },
        placeholderData: keepPreviousData,
    });
}

/** `pollForPromotion` is for the checkout-failure page: a declined card's
 * order only flips `draft` -> `pending` once Razorpay's async webhook lands
 * on the backend (see docs/ABANDONED_CHECKOUT_BACKEND_SPEC.md ยง2.2) - there
 * is no client-side signal for that. The client can reach this page before
 * the webhook arrives, so `GET /customer/purchases/:id` 404s transiently.
 * Retrying with backoff instead of failing once rides out that race instead
 * of leaving the page stuck with no way to retry the payment.
 *
 * Bounded to ~7s, not longer: on staging the webhook has been observed to
 * never arrive at all (see API_MISMATCHES.md, "Razorpay payment.failed
 * webhook never lands"), in which case this 404s forever and the caller
 * should fall back to starting a new checkout rather than make the customer
 * wait on a promotion that isn't coming. */
export function useCustomerPurchase(id: string, options?: { pollForPromotion?: boolean }) {
    return useQuery({
        queryKey: ["customer", "purchases", id],
        queryFn: async () => (await customerPurchaseService.get(id)).data.data,
        enabled: Boolean(id),
        retry: options?.pollForPromotion
            ? (failureCount: number, error: unknown) => {
                  const status = (error as { response?: { status?: number } })?.response?.status;
                  return status === 404 && failureCount < 4;
              }
            : undefined,
        retryDelay: options?.pollForPromotion ? (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 2000) : undefined,
    });
}

export function useVerifyCustomerPurchase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RazorpayHandlerResponse) => customerPurchaseService.verify(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customer", "purchases"] });
            queryClient.invalidateQueries({ queryKey: ["customer", "cart"] });
        },
    });
}

export function usePayPurchaseBalance(orderId: string) {
    return useMutation({
        mutationFn: (payload: { amount: number }) => customerPurchaseService.payBalance(orderId, payload),
    });
}

export function useRetryCustomerPayment() {
    return useMutation({
        mutationFn: (paymentId: string) => customerPurchaseService.retryPayment(paymentId),
    });
}

export function useCustomerPaymentAttempts(paymentId?: string) {
    return useQuery({
        queryKey: ["customer", "payment-attempts", paymentId ?? ""],
        queryFn: async () => {
            const response = await customerPurchaseService.listPaymentAttempts(paymentId!);
            return normalizeList(response.data, 1, 20).data;
        },
        enabled: Boolean(paymentId),
    });
}
