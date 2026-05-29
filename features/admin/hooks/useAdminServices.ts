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

export function useDeleteService(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => adminServiceService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "services"] }),
    });
}
