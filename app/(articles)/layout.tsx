// app/(articles)/layout.tsx

import { MarketingHeader } from "@/features/marketing/components/MarketingHeader";
import { MarketingFooter } from "@/features/marketing/components/MarketingFooter";

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <MarketingHeader />
            <main className="flex-1 pt-24">{children}</main>
            <MarketingFooter />
        </div>
    );
}
