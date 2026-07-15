import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsService } from "@/services/admin.service";

export type AnalyticsRange = {
    from?: string;
    to?: string;
    granularity?: "day" | "month";
};

function assertSuccess<T>(payload: { success: boolean; message?: string; data: T }) {
    if (!payload.success) {
        throw new Error(payload.message || "Analytics request failed");
    }
    return payload.data;
}

export function useRevenueAnalytics(params: AnalyticsRange) {
    return useQuery({
        queryKey: ["admin", "analytics", "revenue", params.from ?? "", params.to ?? "", params.granularity ?? "day"],
        queryFn: async () => assertSuccess((await adminAnalyticsService.revenue(params)).data),
    });
}

export function useOrdersAnalytics(params: AnalyticsRange) {
    return useQuery({
        queryKey: ["admin", "analytics", "orders", params.from ?? "", params.to ?? ""],
        queryFn: async () => assertSuccess((await adminAnalyticsService.orders(params)).data),
    });
}

export function useByServiceAnalytics(params: AnalyticsRange) {
    return useQuery({
        queryKey: ["admin", "analytics", "by-service", params.from ?? "", params.to ?? ""],
        queryFn: async () => assertSuccess((await adminAnalyticsService.byService(params)).data),
    });
}

export function usePaymentHealthAnalytics(params: AnalyticsRange) {
    return useQuery({
        queryKey: ["admin", "analytics", "payment-health", params.from ?? "", params.to ?? ""],
        queryFn: async () => assertSuccess((await adminAnalyticsService.paymentHealth(params)).data),
    });
}
