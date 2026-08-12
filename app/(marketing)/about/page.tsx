// app/(marketing)/about/page.tsx

import type { Metadata } from "next";
import { AboutPage } from "@/features/marketing/components/AboutPage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Built for Founders",
    description:
        "StartupKaro helps you spend less time on paperwork and more time building. Our CAs, CS professionals, and legal experts handle the regulatory heavy lifting, with fixed-cost services and transparent pricing.",
    path: "/about",
});

export default function About() {
    return <AboutPage />;
}
