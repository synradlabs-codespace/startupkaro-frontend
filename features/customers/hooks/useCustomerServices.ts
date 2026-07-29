import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { customerServiceCatalog, normalizeServiceCatalog } from "@/services/customer.service";

export function useCustomerServiceList(params: { search?: string; category?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["customer", "services", params.search ?? "", params.category ?? "", params.page ?? 1, params.limit ?? 20],
        queryFn: async () => {
            const response = await customerServiceCatalog.list(params);
            return normalizeServiceCatalog(response.data, params.page ?? 1, params.limit ?? 20);
        },
        placeholderData: keepPreviousData,
    });
}

export function useCustomerServiceBySlug(slug: string) {
    return useQuery({
        queryKey: ["customer", "services", slug],
        queryFn: async () => (await customerServiceCatalog.getBySlug(slug)).data.data,
        enabled: Boolean(slug),
    });
}
