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

export function useCustomerPurchase(id: string) {
    return useQuery({
        queryKey: ["customer", "purchases", id],
        queryFn: async () => (await customerPurchaseService.get(id)).data.data,
        enabled: Boolean(id),
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
