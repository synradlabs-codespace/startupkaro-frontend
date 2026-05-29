// services/auth.service.ts

import { apiClient } from "./api-client";
import type { ApiResponse } from "@/types/api.types";
import type { AuthResponse, AuthTokens, AuthUser, LoginCredentials } from "@/features/auth/shared/types";
import { ROLES } from "@/lib/rbac/roles";

interface BackendAuthResponse {
    tokens: AuthTokens;
    user: Omit<AuthUser, "role"> & { role?: string };
}

function mapAuthResponse(response: BackendAuthResponse, role: AuthUser["role"]): AuthResponse {
    return {
        tokens: response.tokens,
        user: {
            ...response.user,
            role,
        },
    };
}

export const authService = {
    adminLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<BackendAuthResponse>>("/admin/auth/login", credentials);
        const backendRole = res.data.data.user?.role;
        if (backendRole && backendRole !== ROLES.ADMIN) {
            throw Object.assign(new Error(), {
                response: { data: { message: "Access denied. Please use the correct login page for your role." } },
            });
        }
        return mapAuthResponse(res.data.data, ROLES.ADMIN);
    },

    employeeLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<BackendAuthResponse>>("/admin/auth/login", credentials);
        const backendRole = res.data.data.user?.role;
        if (backendRole && backendRole !== ROLES.EMPLOYEE) {
            throw Object.assign(new Error(), {
                response: { data: { message: "Access denied. Please use the correct login page for your role." } },
            });
        }
        return mapAuthResponse(res.data.data, ROLES.EMPLOYEE);
    },

    customerLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>("/customer/auth/login", credentials);
        return { ...res.data.data, user: { ...res.data.data.user, role: ROLES.CUSTOMER } };
    },

    customerRegister: async (payload: {
        name: string;
        email: string;
        password: string;
        mobile: string;
    }): Promise<AuthResponse> => {
        const res = await apiClient.post<ApiResponse<AuthResponse>>("/customer/auth/signup", {
            name: payload.name,
            email: payload.email,
            password: payload.password,
            phone: payload.mobile,
        });
        return { ...res.data.data, user: { ...res.data.data.user, role: ROLES.CUSTOMER } };
    },

    customerForgotPassword: async (email: string): Promise<{ message: string }> => {
        const res = await apiClient.post<ApiResponse<{ message: string }>>("/customer/auth/forgot-password", { email });
        return res.data.data;
    },

    customerResetPassword: async (payload: {
        token: string;
        password: string;
    }): Promise<{ message: string }> => {
        const res = await apiClient.post<ApiResponse<{ message: string }>>("/customer/auth/reset-password", payload);
        return res.data.data;
    },

    logout: (): void => {
        // No server-side logout endpoint exists yet (see API_MISMATCHES Q10).
        // Session is cleared client-side by clearSession() in useAuth.
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("authUser");
        }
    },
};
