import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerCartService } from "@/services/customer.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function useCustomerCart() {
    return useQuery({
        queryKey: ["customer", "cart"],
        queryFn: async () => (await customerCartService.get()).data.data,
    });
}

export function useAddCartItem() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { serviceId: string; quantity?: number }) =>
            customerCartService.addItem({ serviceId: payload.serviceId, quantity: payload.quantity ?? 1 }),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Added to cart"));
            queryClient.invalidateQueries({ queryKey: ["customer", "cart"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Could not add this service to cart")),
    });
}

export function useUpdateCartItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
            customerCartService.updateItem(id, { quantity }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer", "cart"] }),
    });
}

export function useRemoveCartItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => customerCartService.removeItem(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer", "cart"] }),
    });
}

export function useClearCustomerCart() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => customerCartService.clear(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer", "cart"] }),
    });
}

export function useCheckoutCustomerCart() {
    return useMutation({
        mutationFn: () => customerCartService.checkout(),
    });
}
