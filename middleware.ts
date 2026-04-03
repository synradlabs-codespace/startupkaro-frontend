// middleware.ts
export const config = {
    matcher: ["/admin/:path*", "/employee/:path*", "/customer/:path*"]
}

// Logic:
// - No session → redirect to /{role}/login
// - Wrong role → redirect to own panel or 403
// - Correct role → pass through