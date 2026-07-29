import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerProfileService } from "@/services/customer.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function useCustomerProfile() {
    return useQuery({
        queryKey: ["customer", "profile"],
        queryFn: async () => (await customerProfileService.get()).data.data,
    });
}

export function useUpdateCustomerProfile() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { name: string; phone: string }) => customerProfileService.update(payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Profile updated"));
            queryClient.invalidateQueries({ queryKey: ["customer", "profile"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update profile")),
    });
}

export function useChangeCustomerPassword() {
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
            customerProfileService.changePassword(payload),
        onSuccess: (response) => toast.success(getApiSuccessMessage(response, "Password updated")),
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update password")),
    });
}
