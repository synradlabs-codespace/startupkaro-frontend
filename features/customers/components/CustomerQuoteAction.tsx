"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { getApiErrorMessage } from "@/features/customers/lib/format";
import { getApiSuccessMessage } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";
import { publicInquiryService } from "@/services/customer.service";

export function CustomerQuoteAction({ serviceName, serviceSlug }: { serviceName: string; serviceSlug: string }) {
    const toast = useToast();
    const profileQuery = useCustomerProfile();
    const profile = profileQuery.data;
    const [status, setStatus] = useState<"idle" | "sent">("idle");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submitInquiry = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await publicInquiryService.submit({
                name: profile?.name ?? "Customer",
                email: profile?.email ?? "",
                phone: profile?.phone ?? profile?.mobile ?? "+910000000000",
                subject: `Quote request: ${serviceName}`,
                message: `Customer requested a quote for ${serviceName} (${serviceSlug}).`,
            });
            toast.success(getApiSuccessMessage(response, "Inquiry created"));
            setStatus("sent");
        } catch (err: unknown) {
            const message = getApiErrorMessage(err, "Could not create inquiry. Please contact support.");
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (status === "sent") {
        return (
            <p className="rounded-lg border border-status-positive-border bg-status-positive-bg px-3 py-2 text-center text-xs font-medium text-status-positive-fg">
                Inquiry created. Our team will contact you shortly.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <Button
                type="button"
                onClick={submitInquiry}
                disabled={loading || profileQuery.isLoading || !profile?.email}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary-brand px-4 text-sm font-medium text-white transition-colors hover:bg-primary-brand/90"
            >
                <Send className="h-4 w-4" />
                {loading ? "Creating Inquiry..." : "Request Quote"}
            </Button>
            {error && <p className="text-center text-xs text-error-brand">{error}</p>}
            {!profileQuery.isLoading && !profile?.email && (
                <p className="text-center text-xs text-slate">Profile details are required to create an inquiry.</p>
            )}
        </div>
    );
}
