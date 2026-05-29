import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminInquiryService, type InquiryStatus } from "@/services/admin.service";

export function useInquiryList(params: { search?: string; status?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: ["admin", "inquiries", params.search ?? "", params.status ?? "", params.page ?? 1, params.limit ?? 10],
        queryFn: async () => (await adminInquiryService.list(params)).data,
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
    return useMutation({
        mutationFn: (payload: Partial<{ status: InquiryStatus; notes: { text: string }[] }>) => adminInquiryService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "inquiries", id] });
        },
    });
}

export function useDeleteInquiry(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => adminInquiryService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] }),
    });
}
