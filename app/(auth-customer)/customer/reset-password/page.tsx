// app/(auth-customer)/customer/reset-password/page.tsx

import type { Metadata } from "next";
import { CustomerResetPasswordForm } from "@/features/auth/customer/components/CustomerResetPasswordForm";
import { NOINDEX } from "@/lib/seo/site";

export const metadata: Metadata = NOINDEX;

export default async function CustomerResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;
    return <CustomerResetPasswordForm token={token} />;
}
