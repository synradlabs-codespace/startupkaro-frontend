import { useQuery } from "@tanstack/react-query";
import { adminCustomerService } from "@/services/admin.service";

export function useCustomerList(params: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "customers", params.search ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminCustomerService.list(params)).data,
    });
}

export function useCustomer(id: string) {
    return useQuery({
        queryKey: ["admin", "customers", id],
        queryFn: async () => (await adminCustomerService.get(id)).data,
        enabled: Boolean(id),
    });
}
