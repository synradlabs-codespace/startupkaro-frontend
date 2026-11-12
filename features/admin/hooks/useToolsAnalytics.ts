import { useQuery } from "@tanstack/react-query";
import { toolsAnalyticsService } from "@/services/traffic-analytics.service";
import { assertSuccess } from "./useAdminAnalytics";

/** Free-tools usage and sharing. @param month "YYYY-MM" */
export function useToolsAnalytics(month: string) {
    return useQuery({
        queryKey: ["admin", "analytics", "tools", month],
        queryFn: async () => assertSuccess((await toolsAnalyticsService.get(month)).data),
    });
}
