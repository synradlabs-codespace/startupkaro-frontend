// features/auth/employee/hooks/useEmployeeAuth.ts

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { adminEmployeeService } from "@/services/admin.service";
import { useAuth } from "../../shared/hooks/useAuth";
import { ROLE_REDIRECTS } from "@/lib/rbac/roles";
import type { AuthUser } from "../../shared/types";

export function useEmployeeLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveSession } = useAuth();
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.employeeLogin({ email, password });
            saveSession(response.user, response.tokens);
            router.push(ROLE_REDIRECTS[response.user.role]);
        } catch (err) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e?.response?.data?.message ?? "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}

function loadAuthUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("authUser");
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null;
    }
}

export function useEmployeeMe() {
    const [localUser, setLocalUser] = useState<AuthUser | null>(null);
    useEffect(() => { setLocalUser(loadAuthUser()); }, []);

    const employeeQuery = useQuery({
        queryKey: ["employee", "me", localUser?.id],
        queryFn: async () => (await adminEmployeeService.get(localUser!.id)).data,
        enabled: Boolean(localUser?.id),
        staleTime: 5 * 60 * 1000,
    });
    const employee = employeeQuery.data?.data;
    return {
        id: employee?.id ?? localUser?.id ?? "",
        name: employee?.name ?? localUser?.name ?? "",
        email: employee?.email ?? localUser?.email ?? "",
        phone: employee?.phone ?? "",
        role: employee?.role ?? (localUser?.role as string) ?? "employee",
        isLoading: employeeQuery.isLoading,
    };
}

export function useEmployeeLogout() {
    const { clearSession } = useAuth();
    const router = useRouter();
    return () => {
        clearSession();
        router.push("/employee/login");
    };
}
