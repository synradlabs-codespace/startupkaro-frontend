import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES: Record<string, string> = {
    "/admin": "ADMIN",
    "/employee": "EMPLOYEE",
    "/customer": "CUSTOMER",
};

const LOGIN_ROUTES = new Set([
    "/admin/login",
    "/employee/login",
    "/customer/login",
    "/customer/register",
    "/customer/reset-password",
]);

const LOGIN_REDIRECT: Record<string, string> = {
    ADMIN: "/admin/login",
    EMPLOYEE: "/employee/login",
    CUSTOMER: "/customer/login",
};

const PANEL_HOME: Record<string, string> = {
    ADMIN: "/admin",
    EMPLOYEE: "/employee",
    CUSTOMER: "/customer",
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const role = request.cookies.get("userRole")?.value;
    const token = request.cookies.get("accessToken")?.value;
    const isAuthenticated = !!token && !!role;

    if (LOGIN_ROUTES.has(pathname) && isAuthenticated) {
        const panelHome = PANEL_HOME[role!] ?? "/";
        return NextResponse.redirect(new URL(panelHome, request.url));
    }

    const matchedPanel = Object.keys(PROTECTED_PREFIXES).find(
        (prefix) => pathname.startsWith(prefix) && !LOGIN_ROUTES.has(pathname)
    );

    if (matchedPanel) {
        const requiredRole = PROTECTED_PREFIXES[matchedPanel];

        if (!isAuthenticated) {
            const loginUrl = LOGIN_REDIRECT[requiredRole];
            return NextResponse.redirect(new URL(loginUrl, request.url));
        }

        if (role !== requiredRole) {
            const ownPanel = PANEL_HOME[role!] ?? "/";
            return NextResponse.redirect(new URL(ownPanel, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/employee/:path*", "/customer/:path*"],
};