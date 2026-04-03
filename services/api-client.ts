// services/api-client.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
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

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            const role = localStorage.getItem("userRole");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("authUser");
            document.cookie = "accessToken=; path=/; max-age=0";
            document.cookie = "userRole=; path=/; max-age=0";

            const loginRoutes: Record<string, string> = {
                ADMIN: "/admin/login",
                EMPLOYEE: "/employee/login",
                CUSTOMER: "/customer/login",
            };

            window.location.href = role ? (loginRoutes[role] ?? "/admin/login") : "/admin/login";
        }
        return Promise.reject(error);
    }
);