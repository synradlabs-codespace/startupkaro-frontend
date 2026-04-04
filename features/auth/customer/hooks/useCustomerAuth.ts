// features/auth/customer/hooks/useCustomerAuth.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "../../shared/hooks/useAuth";

export function useCustomerLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveSession } = useAuth();
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            // const response = await authService.customerLogin({ email, password });
            // saveSession(response.user, response.accessToken);
            router.push("/customer");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}

export function useCustomerRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveSession } = useAuth();
    const router = useRouter();

    const register = async (payload: {
        name: string;
        email: string;
        password: string;
        mobile: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            // const response = await authService.customerRegister(payload);
            // saveSession(response.user, response.accessToken);
            router.push("/customer");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error };
}

export function useCustomerResetPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const sendResetEmail = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            await authService.customerForgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { sendResetEmail, loading, error, sent };
}