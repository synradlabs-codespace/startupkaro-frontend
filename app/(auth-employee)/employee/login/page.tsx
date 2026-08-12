// app/(auth-employee)/employee/login/page.tsx


import type { Metadata } from "next";
import { EmployeeLoginForm } from "@/features/auth/employee/components/EmployeeLoginForm";
import { NOINDEX } from "@/lib/seo/site";

export const metadata: Metadata = NOINDEX;

export default function EmployeeLoginPage() {
  return <EmployeeLoginForm />;
}