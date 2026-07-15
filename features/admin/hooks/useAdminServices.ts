import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminBundleService, adminServiceService } from "@/services/admin.service";
import type { AdminService } from "@/services/admin.service";

function isBundleService(service: AdminService) {
    return service.category === "bundles" || service.type === "bundle";
}

export function useServiceList(params: { page?: number; limit?: number } = {}) {
    return useQuery({
        queryKey: ["admin", "services", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => {
            const page = params.page ?? 1;
            const limit = params.limit ?? 10;
            const payload = (await adminServiceService.list({ page: 1, limit: 100 })).data;
            const allStandalone = payload.data.filter((service) => !isBundleService(service));
            const start = (page - 1) * limit;
            const data = allStandalone.slice(start, start + limit);
            return {
                ...payload,
                data,
                pagination: {
                    ...payload.pagination,
                    page,
                    limit,
                    total: allStandalone.length,
                    totalPages: Math.ceil(allStandalone.length / limit),
                },
            };
        },
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
        mutationFn: (payload: Parameters<typeof adminServiceService.create>[0]) =>
            adminServiceService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
    });
}

export function useUpdateService(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminServiceService.update>[1]) =>
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

export function useBundleList() {
    return useQuery({
        queryKey: ["admin", "bundles"],
        queryFn: async () => {
            const res = await adminBundleService.list();
            const payload = res.data;
            const bundles = Array.isArray(payload.data) ? payload.data : [];
            return Promise.all(
                bundles.map(async (bundle) => {
                    try {
                        return (await adminBundleService.get(bundle.id)).data.data;
                    } catch {
                        return bundle;
                    }
                }),
            );
        },
    });
}

export function useBundle(id: string) {
    return useQuery({
        queryKey: ["admin", "bundles", id],
        queryFn: async () => (await adminBundleService.get(id)).data,
        enabled: Boolean(id),
    });
}

export function useCreateBundle() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminBundleService.create>[0]) =>
            adminBundleService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
    });
}

export function useUpdateBundle(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminBundleService.update>[1]) =>
            adminBundleService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
    });
}

export function useDeleteBundle(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => adminBundleService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
    });
}
