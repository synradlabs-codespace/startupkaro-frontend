import { useMutation } from "@tanstack/react-query";
import { publicInquiryService } from "@/services/customer.service";
import { getApiErrorMessage, isRateLimited } from "@/features/customers/lib/format";
import { getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";

export function useSubmitInquiry() {
    const toast = useToast();
    return useMutation({
        mutationFn: (payload: { name: string; email: string; phone?: string; subject?: string; message: string; serviceId?: string }) =>
            publicInquiryService.submit(payload),
        onSuccess: (response) => toast.success(getApiSuccessMessage(response, "Quote request sent")),
        onError: (error) =>
            toast.error(
                isRateLimited(error)
                    ? "Too many requests were sent recently. Please wait a little and try again."
                    : getApiErrorMessage(error, "We could not send your request. Please try again.")
            ),
    });
}
