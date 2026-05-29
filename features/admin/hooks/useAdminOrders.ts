import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminOrderService } from "@/services/admin.service";

export function useOrderList(params: { search?: string; status?: string; customerId?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "orders", params.search ?? "", params.status ?? "", params.customerId ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminOrderService.list(params)).data,
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
    return useMutation({
        mutationFn: (payload: { customerId: string; serviceId: string; amount: number; status?: string; notes?: string }) =>
            adminOrderService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "orders"] }),
    });
}

export function useUpdateOrder(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<{ status: string; amount: number; notes: { text: string }[] }>) =>
            adminOrderService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders", id] });
        },
    });
}
