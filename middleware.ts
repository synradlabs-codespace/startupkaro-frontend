// ================ UNCOMMENT THIS FOR PRODUCTION ==================


// import { NextRequest, NextResponse } from "next/server";

// const PROTECTED_PREFIXES: Record<string, string> = {
//     "/admin": "ADMIN",
//     "/employee": "EMPLOYEE",
//     "/customer": "CUSTOMER",
// };

// const LOGIN_ROUTES = new Set([
//     "/admin/login",
//     "/employee/login",
//     "/customer/login",
//     "/customer/register",
//     "/customer/reset-password",
// ]);

// const LOGIN_REDIRECT: Record<string, string> = {
//     ADMIN: "/admin/login",
//     EMPLOYEE: "/employee/login",
//     CUSTOMER: "/customer/login",
// };

// const PANEL_HOME: Record<string, string> = {
//     ADMIN: "/admin",
//     EMPLOYEE: "/employee",
//     CUSTOMER: "/customer",
// };

// export function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     // Read auth state from cookies (set client-side after login)
//     const role = request.cookies.get("userRole")?.value;
//     const token = request.cookies.get("accessToken")?.value;
//     const isAuthenticated = !!token && !!role;

//     // Authenticated user hitting a login page → send to their panel
//     if (LOGIN_ROUTES.has(pathname) && isAuthenticated) {
//         return NextResponse.redirect(
//             new URL(PANEL_HOME[role!] ?? "/", request.url)
//         );
//     }

//     // Protected panel route — not a login page
//     const matchedPanel = Object.keys(PROTECTED_PREFIXES).find(
//         (prefix) => pathname.startsWith(prefix) && !LOGIN_ROUTES.has(pathname)
//     );

//     if (matchedPanel) {
//         const requiredRole = PROTECTED_PREFIXES[matchedPanel];

//         if (!isAuthenticated) {
//             return NextResponse.redirect(
//                 new URL(LOGIN_REDIRECT[requiredRole], request.url)
//             );
//         }

//         if (role !== requiredRole) {
//             return NextResponse.redirect(
//                 new URL(PANEL_HOME[role!] ?? "/", request.url)
//             );
//         }
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/admin/:path*", "/employee/:path*", "/customer/:path*"],
// };


// ============================================== 

import { NextRequest, NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
    // Auth middleware disabled until backend APIs are ready.
    // TODO: Re-enable role-based route protection once JWT auth is implemented.
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/employee/:path*", "/customer/:path*"],
};
