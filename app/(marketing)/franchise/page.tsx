import type { Metadata } from "next";
import { FranchisePage } from "@/features/marketing/components/FranchisePage";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
    title: "Franchise Consulting",
    description:
        "End-to-end franchise consulting for business models, legal frameworks, operational systems, brand protection, and expansion strategy in India and international markets.",
    path: "/franchise",
});

export default function Page() {
    return <FranchisePage />;
}
