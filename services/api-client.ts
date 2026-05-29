// services/api-client.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://server.startupkaro.in/api/v1";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// Bare client used only for token refresh — no interceptors to avoid recursion.
const refreshClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function clearSessionAndRedirect() {
    const role = localStorage.getItem("userRole");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("authUser");
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "userRole=; path=/; max-age=0";

    const loginRoutes: Record<string, string> = {
        admin: "/admin/login",
        employee: "/employee/login",
        customer: "/customer/login",
    };

    window.location.href = role ? (loginRoutes[role] ?? "/admin/login") : "/admin/login";
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status !== 401 || typeof window === "undefined") {
            return Promise.reject(error);
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const refreshToken = localStorage.getItem("refreshToken");
        const role = localStorage.getItem("userRole");

        // Don't attempt refresh if this was already a retry, a refresh call itself, or we have no token.
        const isRefreshCall = originalRequest.url?.includes("/auth/refresh");
        if (originalRequest._retry || isRefreshCall || !refreshToken) {
            clearSessionAndRedirect();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Single-flight: concurrent 401s share one refresh call.
        if (!isRefreshing) {
            isRefreshing = true;
            const refreshRoute = role === "customer"
                ? "/customer/auth/refresh"
                : "/admin/auth/refresh";

            refreshPromise = refreshClient
                .post<{ data: { accessToken: string; refreshToken?: string } }>(refreshRoute, { refreshToken })
                .then((res) => {
                    const newAccess = res.data.data.accessToken;
                    const newRefresh = res.data.data.refreshToken;
                    localStorage.setItem("accessToken", newAccess);
                    if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
                    document.cookie = `accessToken=${newAccess}; path=/; SameSite=Lax`;
                    return newAccess;
                })
                .catch((refreshError) => {
                    clearSessionAndRedirect();
                    return Promise.reject(refreshError);
                })
                .finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });
        }

        try {
            const newAccessToken = await refreshPromise!;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch {
            return Promise.reject(error);
        }
    }
);
