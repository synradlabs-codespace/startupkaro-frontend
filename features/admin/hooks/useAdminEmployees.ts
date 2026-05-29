import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminEmployeeService, type AdminRole } from "@/services/admin.service";

export function useEmployeeList(params: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "employees", params.search ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminEmployeeService.list(params)).data,
    });
}

export function useEmployee(id: string) {
    return useQuery({
        queryKey: ["admin", "employees", id],
        queryFn: async () => (await adminEmployeeService.get(id)).data,
        enabled: Boolean(id),
    });
}

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { name: string; email: string; password: string; phone?: string; role: AdminRole }) =>
            adminEmployeeService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "employees"] }),
    });
}

export function useUpdateEmployee(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: Partial<{ name: string; isActive: boolean; role: AdminRole }>) =>
            adminEmployeeService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "employees"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "employees", id] });
        },
    });
}
