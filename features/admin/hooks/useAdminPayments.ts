import { useQuery } from "@tanstack/react-query";
import { adminPaymentService } from "@/services/admin.service";

export function usePaymentList(params: { search?: string; status?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "payments", params.search ?? "", params.status ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminPaymentService.list(params)).data,
    });
}

export function usePayment(id: string) {
    return useQuery({
        queryKey: ["admin", "payments", id],
        queryFn: async () => (await adminPaymentService.get(id)).data,
        enabled: Boolean(id),
    });
}
