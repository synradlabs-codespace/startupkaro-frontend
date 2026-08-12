// app/customer/layout.tsx

import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo/site";
import { CustomerLayoutShell } from "@/features/customers/components/CustomerLayoutShell";

export const metadata: Metadata = NOINDEX;

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return <CustomerLayoutShell>{children}</CustomerLayoutShell>;
}
