// app/(auth-customer)/customer/register/page.tsx


import type { Metadata } from "next";
import { CustomerRegisterForm } from "@/features/auth/customer/components/CustomerRegisterForm";
import { NOINDEX } from "@/lib/seo/site";

export const metadata: Metadata = NOINDEX;

export default function CustomerRegisterPage() {
    return <CustomerRegisterForm />;
}