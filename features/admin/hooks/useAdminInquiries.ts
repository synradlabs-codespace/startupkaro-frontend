import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminInquiryService, type InquiryStatus } from "@/services/admin.service";
import { getApiErrorMessage, getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function useInquiryList(params: { search?: string; status?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "inquiries", params.search ?? "", params.status ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminInquiryService.list(params)).data,
        placeholderData: keepPreviousData,
    });
}

export function useInquiry(id: string) {
    return useQuery({
        queryKey: ["admin", "inquiries", id],
        queryFn: async () => (await adminInquiryService.get(id)).data,
        enabled: Boolean(id),
    });
}

export function useUpdateInquiry(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: Partial<{ status: InquiryStatus; notes: { text: string }[] }>) => adminInquiryService.update(id, payload),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Inquiry updated"));
            queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "inquiries", id] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to update inquiry")),
    });
}

export function useDeleteInquiry(id: string) {
    const queryClient = useQueryClient();
    const toast = useToast();
    return useMutation({
        mutationFn: () => adminInquiryService.remove(id),
        onSuccess: (response) => {
            toast.success(getApiSuccessMessage(response, "Inquiry deleted"));
            queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to delete inquiry")),
    });
}
