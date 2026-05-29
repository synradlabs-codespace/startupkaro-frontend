"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/rbac/roles";
import { ROLE_LOGIN_ROUTES } from "@/lib/rbac/roles";

export function RoleGuard({ requiredRole, children }: { requiredRole: Role; children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const token = localStorage.getItem("accessToken");
        if (token && role === requiredRole) {
            setAuthorized(true);
        } else {
            router.replace(ROLE_LOGIN_ROUTES[requiredRole]);
        }
    }, [requiredRole, router]);

    if (!authorized) return null;
    return <>{children}</>;
}
