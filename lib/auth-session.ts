import type { AuthTokens, AuthUser } from "@/features/auth/shared/types";
import type { Role } from "@/lib/rbac/roles";
import { ROLE_REDIRECTS } from "@/lib/rbac/roles";

export const AUTH_SESSION_EVENT = "startupkaro-auth-session";

export type AuthSession = {
    user: AuthUser | null;
    role: Role | null;
    accessToken: string | null;
    refreshToken: string | null;
};

function parseUser(value: string | null): AuthUser | null {
    if (!value) return null;
    try {
        return JSON.parse(value) as AuthUser;
    } catch {
        localStorage.removeItem("authUser");
        return null;
    }
}

function notifyAuthSessionChanged() {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function readAuthSession(): AuthSession {
    if (typeof window === "undefined") {
        return { user: null, role: null, accessToken: null, refreshToken: null };
    }

    const user = parseUser(localStorage.getItem("authUser"));
    const role = (localStorage.getItem("userRole") ?? user?.role ?? null) as Role | null;
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    return { user, role, accessToken, refreshToken };
}

export function hasAuthSession(role?: Role) {
    const session = readAuthSession();
    if (!session.accessToken || !session.role) return false;
    return role ? session.role === role : true;
}

export function getPanelRedirect(role?: Role | null) {
    return role ? ROLE_REDIRECTS[role] ?? "/" : "/";
}

export function saveAuthSession(authUser: AuthUser, tokens: AuthTokens) {
    localStorage.setItem("authUser", JSON.stringify(authUser));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    localStorage.setItem("userRole", authUser.role);
    document.cookie = `accessToken=${tokens.accessToken}; path=/; SameSite=Lax`;
    document.cookie = `userRole=${authUser.role}; path=/; SameSite=Lax`;
    notifyAuthSessionChanged();
}

export function clearAuthSession() {
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "userRole=; path=/; max-age=0; SameSite=Lax";
    notifyAuthSessionChanged();
}
