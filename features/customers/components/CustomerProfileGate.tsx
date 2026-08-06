"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProfileCompletion } from "@/features/customers/hooks/useProfileCompletion";

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
    const { isLoading, isComplete } = useProfileCompletion();
    const onCompleteProfileRoute = pathname === COMPLETE_PROFILE_ROUTE;

    useEffect(() => {
        if (isLoading) return;
        if (!isComplete && !onCompleteProfileRoute) {
            router.replace(COMPLETE_PROFILE_ROUTE);
        } else if (isComplete && onCompleteProfileRoute) {
            router.replace("/customer");
        }
    }, [isLoading, isComplete, onCompleteProfileRoute, router]);

    if (isLoading) return null;
    if (!isComplete && !onCompleteProfileRoute) return null;
    if (isComplete && onCompleteProfileRoute) return null;

    return <>{children}</>;
}
