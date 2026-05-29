// app/(auth-customer)/customer/reset-password/page.tsx

import { CustomerResetPasswordForm } from "@/features/auth/customer/components/CustomerResetPasswordForm";

export default async function CustomerResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;
    return <CustomerResetPasswordForm token={token} />;
}
