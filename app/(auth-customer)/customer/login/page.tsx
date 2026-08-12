// app/(auth-customer)/customer/login/page.tsx

import type { Metadata } from "next";
import { CustomerLoginForm } from "@/features/auth/customer/components/CustomerLoginForm";
import { NOINDEX } from "@/lib/seo/site";

export const metadata: Metadata = NOINDEX;

export default function CustomerLoginPage() {
    return <CustomerLoginForm />;
}