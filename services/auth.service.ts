// services/auth.service.ts

import { apiClient } from "./api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AuthResponse, LoginCredentials } from "@/features/auth/shared/types";

export const authService = {
    adminLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/admin/login", credentials);
        return res.data.data;
    },

    employeeLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/employee/login", credentials);
        return res.data.data;
    },

    customerLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/customer/login", credentials);
        return res.data.data;
    },

    customerRegister: async (payload: {
        name: string;
        email: string;
        password: string;
        mobile: string;
    }): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/customer/register", payload);
        return res.data.data;
    },

    customerForgotPassword: async (email: string): Promise<{ message: string }> => {
        const res = await apiClient.post<ApiResponse<{ message: string }>>("/auth/customer/forgot-password", { email });
        return res.data.data;
    },

    customerResetPassword: async (payload: {
        token: string;
        password: string;
    }): Promise<{ message: string }> => {
        const res = await apiClient.post<ApiResponse<{ message: string }>>("/auth/customer/reset-password", payload);
        return res.data.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post("/auth/logout");
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("authUser");
        }
    },
};