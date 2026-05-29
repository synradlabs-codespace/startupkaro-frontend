import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerProfileService } from "@/services/customer.service";

export function useCustomerProfile() {
    return useQuery({
        queryKey: ["customer", "profile"],
        queryFn: async () => (await customerProfileService.get()).data.data,
    });
}

export function useUpdateCustomerProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { name: string; phone: string }) => customerProfileService.update(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer", "profile"] }),
    });
}

export function useChangeCustomerPassword() {
    return useMutation({
        mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
            customerProfileService.changePassword(payload),
    });
}
