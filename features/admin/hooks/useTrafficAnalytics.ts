import { useQuery } from "@tanstack/react-query";
import { trafficAnalyticsService } from "@/services/traffic-analytics.service";
import { assertSuccess } from "./useAdminAnalytics";

/** @param month "YYYY-MM"; the current calendar month if omitted. */
export function useTrafficAnalytics(month: string) {
    return useQuery({
        queryKey: ["admin", "analytics", "traffic", month],
        queryFn: async () => assertSuccess((await trafficAnalyticsService.get(month)).data),
    });
}
