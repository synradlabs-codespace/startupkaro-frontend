import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerAddressService, type CustomerAddressPayload } from "@/services/customer.service";

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
    return useMutation({
        mutationFn: (payload: CustomerAddressPayload) => customerAddressService.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
    });
}

export function useUpdateCustomerAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomerAddressPayload> }) =>
            customerAddressService.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
    });
}

export function useSetDefaultCustomerAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => customerAddressService.setDefault(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
    });
}

export function useDeleteCustomerAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => customerAddressService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEY }),
    });
}
