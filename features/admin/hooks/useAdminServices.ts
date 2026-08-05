import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminBundleService, adminServiceService } from "@/services/admin.service";
import type { AdminService } from "@/services/admin.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

function isBundleService(service: AdminService) {
    return service.category === "bundles" || service.type === "bundle";
}

export type ServiceStatusFilter = "all" | "active" | "inactive";

export function useServiceList(params: { page?: number; limit?: number; search?: string; status?: ServiceStatusFilter } = {}) {
    return useQuery({
        queryKey: ["admin", "services", params.page ?? 1, params.limit ?? 10, params.search ?? "", params.status ?? "all"],
        queryFn: async () => {
            const page = params.page ?? 1;
            const limit = params.limit ?? 10;
            const search = params.search?.trim().toLowerCase() ?? "";
            const status = params.status ?? "all";
            const payload = (await adminServiceService.list({ page: 1, limit: 100 })).data;
            const allStandalone = payload.data
                .filter((service) => !isBundleService(service))
                .filter((service) => {
                    if (status === "active") return service.isActive !== false;
                    if (status === "inactive") return service.isActive === false;
                    return true;
                })
                .filter((service) => !search || service.name.toLowerCase().includes(search));
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
        placeholderData: keepPreviousData,
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
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminServiceService.create>[0]) =>
            adminServiceService.create(payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Service created"));
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create service")),
    });
}

export function useUpdateService(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminServiceService.update>[1]) =>
            adminServiceService.update(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Service updated"));
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services", id] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update service")),
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
        staleTime: 5 * 60 * 1000, // 5 min. Revalidate webhook keeps Sanity side fresh
    });
}

export function useDeleteService(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: () => adminServiceService.remove(id),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Service deactivated"));
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete service")),
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
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminBundleService.create>[0]) =>
            adminBundleService.create(payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Bundle created"));
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create bundle")),
    });
}

export function useUpdateBundle(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Parameters<typeof adminBundleService.update>[1]) =>
            adminBundleService.update(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Bundle updated"));
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles", id] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update bundle")),
    });
}

export function useDeleteBundle(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: () => adminBundleService.remove(id),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Bundle deleted"));
            queryClient.invalidateQueries({ queryKey: ["admin", "bundles"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete bundle")),
    });
}
