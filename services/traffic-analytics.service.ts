// services/traffic-analytics.service.ts
//
// Calls this app's own /api/admin/analytics/traffic route handler (same-origin
// Next.js route, not the StartupKaro backend), which holds the PostHog keys
// server-side and proxies visitor stats back. Deliberately not routed through
// apiClient — that instance's baseURL points at the backend API, not this app.

import axios from "axios";
import type { ApiResponse } from "@/types/api.types";
import type { AdminTrafficAnalytics } from "@/app/api/admin/analytics/traffic/route";

const internalClient = axios.create({ headers: { "Content-Type": "application/json" } });

internalClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const trafficAnalyticsService = {
    /** @param month "YYYY-MM"; omit for the current calendar month. */
    get: (month: string) =>
        internalClient.get<ApiResponse<AdminTrafficAnalytics>>("/api/admin/analytics/traffic", { params: { month } }),
};

export type { AdminTrafficAnalytics };
