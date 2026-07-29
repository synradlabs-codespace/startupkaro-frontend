// features/auth/admin/hooks/useAdminAuth.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "../../shared/hooks/useAuth";
import { getPostLoginRedirect } from "@/features/auth/shared/hooks/useAuthRedirect";

export function useAdminLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveSession } = useAuth();
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.adminLogin({ email, password });
            saveSession(response.user, response.tokens);
            const searchParams = new URLSearchParams(window.location.search);
            router.replace(getPostLoginRedirect(response.user.role, searchParams.get("next")));
        } catch (err) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e?.response?.data?.message ?? "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}
