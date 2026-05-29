// features/auth/customer/hooks/useCustomerAuth.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "../../shared/hooks/useAuth";
import { ROLE_REDIRECTS } from "@/lib/rbac/roles";

type AxiosLikeError = { response?: { data?: { message?: string } } };

export function useCustomerLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveSession } = useAuth();
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.customerLogin({ email, password });
            saveSession(response.user, response.tokens);
            router.push(ROLE_REDIRECTS[response.user.role]);
        } catch (err) {
            const e = err as AxiosLikeError;
            setError(e?.response?.data?.message ?? "Invalid credentials");
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
            const response = await authService.customerRegister(payload);
            saveSession(response.user, response.tokens);
            router.push(ROLE_REDIRECTS[response.user.role]);
        } catch (err) {
            const e = err as AxiosLikeError;
            setError(e?.response?.data?.message ?? "Registration failed");
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
        } catch (err) {
            const e = err as AxiosLikeError;
            setError(e?.response?.data?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { sendResetEmail, loading, error, sent };
}

export function useCustomerConfirmReset() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const confirmReset = async (token: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            await authService.customerResetPassword({ token, password });
            setDone(true);
        } catch (err) {
            const e = err as AxiosLikeError;
            setError(e?.response?.data?.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return { confirmReset, loading, error, done };
}
