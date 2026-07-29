import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminEmployeeService, type AdminRole } from "@/services/admin.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function useEmployeeList(params: { search?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "employees", params.search ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminEmployeeService.list(params)).data,
        placeholderData: keepPreviousData,
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
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { name: string; email: string; password: string; phone?: string; role: AdminRole }) =>
            adminEmployeeService.create(payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Employee created"));
            queryClient.invalidateQueries({ queryKey: ["admin", "employees"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create employee")),
    });
}

export function useUpdateEmployee(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Partial<{ name: string; isActive: boolean; role: AdminRole }>) =>
            adminEmployeeService.update(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Employee updated"));
            queryClient.invalidateQueries({ queryKey: ["admin", "employees"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "employees", id] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update employee")),
    });
}
