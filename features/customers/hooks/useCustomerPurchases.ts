import { useMutation, useQuery } from "@tanstack/react-query";
import { customerPurchaseService, normalizeList } from "@/services/customer.service";
import type { RazorpayHandlerResponse } from "@/lib/razorpay";

export function useCustomerPurchaseList(params: { page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["customer", "purchases", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => {
            const response = await customerPurchaseService.list(params);
            return normalizeList(response.data, params.page ?? 1, params.limit ?? 10);
        },
    });
}

export function useCustomerPurchase(id: string) {
    return useQuery({
        queryKey: ["customer", "purchases", id],
        queryFn: async () => (await customerPurchaseService.get(id)).data.data,
        enabled: Boolean(id),
    });
}

export function useInitiateCustomerPurchase() {
    return useMutation({
        mutationFn: (payload: { serviceId: string }) => customerPurchaseService.initiate(payload),
    });
}

export function useVerifyCustomerPurchase() {
    return useMutation({
        mutationFn: (payload: RazorpayHandlerResponse) => customerPurchaseService.verify(payload),
    });
}
