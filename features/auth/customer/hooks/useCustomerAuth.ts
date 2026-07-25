// features/auth/customer/hooks/useCustomerAuth.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "../../shared/hooks/useAuth";
import { ROLE_REDIRECTS } from "@/lib/rbac/roles";
import type { AuthResponse } from "@/features/auth/shared/types";
import type { CustomerAuthResult } from "@/services/auth.service";

type AxiosLikeError = { response?: { data?: { message?: string } } };

type CompleteRegistrationPayload = {
    registrationToken: string;
    name?: string;
    email?: string;
    phone?: string;
};

function getErrorMessage(err: unknown, fallback: string) {
    const e = err as AxiosLikeError;
    return e?.response?.data?.message ?? fallback;
}

function useCustomerAuthActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveSession } = useAuth();
    const router = useRouter();

    const finishAuthenticated = (response: AuthResponse) => {
        saveSession(response.user, response.tokens);
        router.push(ROLE_REDIRECTS[response.user.role]);
    };

    const continueWithGoogle = async (idToken: string): Promise<CustomerAuthResult | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.customerGoogle(idToken);
            if (response.status === "authenticated") {
                finishAuthenticated({ user: response.user, tokens: response.tokens });
            }
            return response;
        } catch (err) {
            setError(getErrorMessage(err, "Google sign in failed"));
            return null;
        } finally {
            setLoading(false);
        }
    };

    const completeRegistration = async (payload: CompleteRegistrationPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.customerCompleteRegistration(payload);
            finishAuthenticated(response);
        } catch (err) {
            setError(getErrorMessage(err, "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, setLoading, setError, finishAuthenticated, continueWithGoogle, completeRegistration };
}

export function useCustomerLogin() {
    const auth = useCustomerAuthActions();

    const login = async (email: string, password: string) => {
        auth.setLoading(true);
        auth.setError(null);
        try {
            const response = await authService.customerLogin({ email, password });
            auth.finishAuthenticated(response);
        } catch (err) {
            auth.setError(getErrorMessage(err, "Invalid credentials"));
        } finally {
            auth.setLoading(false);
        }
    };

    return {
        login,
        continueWithGoogle: auth.continueWithGoogle,
        completeRegistration: auth.completeRegistration,
        loading: auth.loading,
        error: auth.error,
    };
}

export function useCustomerRegister() {
    const auth = useCustomerAuthActions();

    const register = async (payload: {
        name: string;
        email: string;
        password: string;
        mobile: string;
    }) => {
        auth.setLoading(true);
        auth.setError(null);
        try {
            const response = await authService.customerRegister(payload);
            auth.finishAuthenticated(response);
        } catch (err) {
            auth.setError(getErrorMessage(err, "Registration failed"));
        } finally {
            auth.setLoading(false);
        }
    };

    return {
        register,
        continueWithGoogle: auth.continueWithGoogle,
        completeRegistration: auth.completeRegistration,
        loading: auth.loading,
        error: auth.error,
    };
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
            setError(getErrorMessage(err, "Something went wrong"));
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
            setError(getErrorMessage(err, "Something went wrong"));
        } finally {
            setLoading(false);
        }
    };

    return { confirmReset, loading, error, done };
}
