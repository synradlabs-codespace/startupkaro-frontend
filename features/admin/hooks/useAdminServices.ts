import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminServiceService } from "@/services/admin.service";

export function useServiceList(params: { page?: number; limit?: number } = {}) {
    return useQuery({
        queryKey: ["admin", "services", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminServiceService.list(params)).data,
    });
}

export function useService(id: string) {
    return useQuery({
        queryKey: ["admin", "services", id],
        queryFn: async () => (await adminServiceService.get(id)).data,
        enabled: Boolean(id),
    });
}

export function useCreateService() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { name: string; slug?: string; description?: string; price: number; isActive?: boolean }) =>
            adminServiceService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
    });
}

export function useUpdateService(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<{ name: string; slug: string; description: string; price: number; isActive: boolean }>) =>
            adminServiceService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services", id] });
        },
    });
}

// Returns a Set of slugs that have live Sanity CMS content.
// Used by admin UI to flag services missing their editorial content.
export function useServiceContentSlugs() {
    return useQuery({
        queryKey: ["admin", "service-content-slugs"],
        queryFn: async () => {
            const res = await fetch("/api/sanity/service-slugs");
            const json: { slugs: string[] } = await res.json();
            return new Set<string>(json.slugs ?? []);
        },
        staleTime: 5 * 60 * 1000, // 5 min — revalidate webhook keeps Sanity side fresh
    });
}

export function useDeleteService(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => adminServiceService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
    });
}
