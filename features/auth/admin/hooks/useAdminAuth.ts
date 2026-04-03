// features/auth/admin/hooks/useAdminAuth.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useAuth } from "../../shared/hooks/useAuth";

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
            saveSession(response.user, response.accessToken);
            router.push("/admin");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}