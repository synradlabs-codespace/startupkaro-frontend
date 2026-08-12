// app/(auth-admin)/admin/login/page.tsx

import type { Metadata } from "next";
import { AdminLoginForm } from "@/features/auth/admin/components/AdminLoginForm";
import { NOINDEX } from "@/lib/seo/site";

export const metadata: Metadata = NOINDEX;

export default function AdminLoginPage() {
    return <AdminLoginForm />;
}