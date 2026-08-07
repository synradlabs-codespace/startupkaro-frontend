"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useProfileCompletion } from "@/features/customers/hooks/useProfileCompletion";
import { getSafeRoleNext } from "@/features/auth/shared/hooks/useAuthRedirect";

const COMPLETE_PROFILE_ROUTE = "/customer/complete-profile";

/**
 * Unskippable gate: a customer with no name/phone/billing address is bounced
 * to /customer/complete-profile on every route, including a direct URL visit
 * or refresh. There is no server-side "profile complete" flag, so this is
 * derived client-side from the profile + address queries (see
 * useProfileCompletion). Mounted inside RoleGuard in app/customer/layout.tsx.
 */
export function CustomerProfileGate({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoading, isComplete } = useProfileCompletion();
    const onCompleteProfileRoute = pathname === COMPLETE_PROFILE_ROUTE;

    useEffect(() => {
        if (isLoading) return;
        if (!isComplete && !onCompleteProfileRoute) {
            // Preserve the page the customer was actually trying to reach (e.g.
            // /customer/services/gst-registration) so completing their profile
            // sends them back there instead of the generic dashboard.
            const query = searchParams.toString();
            const next = `${pathname}${query ? `?${query}` : ""}`;
            router.replace(`${COMPLETE_PROFILE_ROUTE}?next=${encodeURIComponent(next)}`);
        } else if (isComplete && onCompleteProfileRoute) {
            const safeNext = getSafeRoleNext("customer", searchParams.get("next"));
            router.replace(safeNext ?? "/customer");
        }
    }, [isLoading, isComplete, onCompleteProfileRoute, pathname, router, searchParams]);

    if (isLoading) return null;
    if (!isComplete && !onCompleteProfileRoute) return null;
    if (isComplete && onCompleteProfileRoute) return null;

    return <>{children}</>;
}
