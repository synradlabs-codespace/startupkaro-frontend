import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPaymentService } from "@/services/admin.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function usePaymentList(params: { search?: string; status?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "payments", params.search ?? "", params.status ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminPaymentService.list(params)).data,
        placeholderData: keepPreviousData,
    });
}

export function usePayment(id: string) {
    return useQuery({
        queryKey: ["admin", "payments", id],
        queryFn: async () => (await adminPaymentService.get(id)).data,
        enabled: Boolean(id),
    });
}

export function useVoidPayment(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { reason: string }) => adminPaymentService.voidReceipt(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Receipt voided"));
            queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "payments", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to void receipt")),
    });
}
