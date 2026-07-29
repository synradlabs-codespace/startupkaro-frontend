import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminOrderService } from "@/services/admin.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function useOrderList(params: { search?: string; status?: string; customerId?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "orders", params.search ?? "", params.status ?? "", params.customerId ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminOrderService.list(params)).data,
        placeholderData: keepPreviousData,
    });
}

export function useCustomerOrders(customerId: string) {
    return useQuery({
        queryKey: ["admin", "orders", "customer", customerId],
        queryFn: async () => (await adminOrderService.listByCustomer(customerId)).data,
        enabled: Boolean(customerId),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ["admin", "orders", id],
        queryFn: async () => (await adminOrderService.get(id)).data,
        enabled: Boolean(id),
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { customerId: string; serviceId: string; amount: number; status?: string; notes?: string; inquiryId?: string }) =>
            adminOrderService.create(payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Order created"));
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create order")),
    });
}

export function useUpdateOrder(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Partial<{ status: string; amount: number; notes: { text: string }[] }>) =>
            adminOrderService.update(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Order updated"));
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", id] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update order")),
    });
}

export function useOrderPayments(id: string) {
    return useQuery({
        queryKey: ["admin", "orders", id, "payments"],
        queryFn: async () => (await adminOrderService.listPayments(id)).data.data,
        enabled: Boolean(id),
    });
}

export function useRecordOfflinePayment(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { amount: number; reference?: string; paidAt?: string }) =>
            adminOrderService.recordOfflinePayment(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", id, "payments"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
        },
    });
}
