"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_SESSION_EVENT, getPanelRedirect, readAuthSession } from "@/lib/auth-session";
import type { Role } from "@/lib/rbac/roles";

export function getSafeRoleNext(role: Role, next?: string | null) {
    if (!next) return null;

    const roleRoot = `/${role}`;
    const isRoleRoute =
        next === roleRoot ||
        next.startsWith(`${roleRoot}/`) ||
        next.startsWith(`${roleRoot}?`);

    if (!isRoleRoute || next.includes("\\") || next.startsWith("//")) {
        return null;
    }

    return next;
}

export function getPostLoginRedirect(role: Role, next?: string | null) {
    const safeNext = getSafeRoleNext(role, next);
    if (safeNext) return safeNext;
    return getPanelRedirect(role);
}

export function buildAuthRouteWithNext(route: string, role: Role, next?: string | null) {
    const safeNext = getSafeRoleNext(role, next);
    if (!safeNext) return route;

    const searchParams = new URLSearchParams({ next: safeNext });
    return `${route}?${searchParams.toString()}`;
}

export function useRedirectIfAuthenticated() {
    const router = useRouter();

    useEffect(() => {
        const redirect = () => {
            const session = readAuthSession();
            if (session.accessToken && session.role) {
                const searchParams = new URLSearchParams(window.location.search);
                router.replace(getPostLoginRedirect(session.role, searchParams.get("next")));
            }
        };

        redirect();
        window.addEventListener("storage", redirect);
        window.addEventListener(AUTH_SESSION_EVENT, redirect);
        return () => {
            window.removeEventListener("storage", redirect);
            window.removeEventListener(AUTH_SESSION_EVENT, redirect);
        };
    }, [router]);
}
