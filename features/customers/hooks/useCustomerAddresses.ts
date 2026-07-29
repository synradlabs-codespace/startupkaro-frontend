import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerAddressService, type CustomerAddressPayload } from "@/services/customer.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

const ADDRESS_QUERY_KEY = ["customer", "addresses"] as const;
const STATE_QUERY_KEY = ["customer", "addresses", "states"] as const;

export function useCustomerAddressStates() {
    return useQuery({
        queryKey: STATE_QUERY_KEY,
        queryFn: async () => (await customerAddressService.states()).data.data,
    });
}

export function useCustomerAddresses() {
    return useQuery({
        queryKey: ADDRESS_QUERY_KEY,
        queryFn: async () => (await customerAddressService.list()).data.data,
    });
}

export function useCreateCustomerAddress() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: CustomerAddressPayload) => customerAddressService.create(payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Address added"));
            queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to add address")),
    });
}

export function useUpdateCustomerAddress() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomerAddressPayload> }) =>
            customerAddressService.update(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Address updated"));
            queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update address")),
    });
}

export function useSetDefaultCustomerAddress() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (id: string) => customerAddressService.setDefault(id),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Default billing address updated"));
            queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to set default address")),
    });
}

export function useDeleteCustomerAddress() {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (id: string) => customerAddressService.remove(id),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Address deleted"));
            queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete address")),
    });
}
