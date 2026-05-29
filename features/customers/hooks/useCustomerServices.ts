import { useQuery } from "@tanstack/react-query";
import { customerServiceCatalog, normalizeList } from "@/services/customer.service";

export function useCustomerServiceList(params: { search?: string; category?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["customer", "services", params.search ?? "", params.category ?? "", params.page ?? 1, params.limit ?? 20],
        queryFn: async () => {
            const response = await customerServiceCatalog.list(params);
            return normalizeList(response.data, params.page ?? 1, params.limit ?? 20);
        },
    });
}
