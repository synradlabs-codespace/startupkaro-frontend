"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/lib/rbac/roles";
import { ROLE_LOGIN_ROUTES } from "@/lib/rbac/roles";
import { AUTH_SESSION_EVENT, hasAuthSession } from "@/lib/auth-session";

export function RoleGuard({ requiredRole, children }: { requiredRole: Role; children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            if (hasAuthSession(requiredRole)) {
                setAuthorized(true);
                return;
            }

            setAuthorized(false);
            const query = window.location.search.replace(/^\?/, "");
            const next = `${pathname}${query ? `?${query}` : ""}`;
            router.replace(`${ROLE_LOGIN_ROUTES[requiredRole]}?next=${encodeURIComponent(next)}`);
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        window.addEventListener(AUTH_SESSION_EVENT, checkAuth);
        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener(AUTH_SESSION_EVENT, checkAuth);
        };
    }, [pathname, requiredRole, router]);

    if (!authorized) return null;
    return <>{children}</>;
}
