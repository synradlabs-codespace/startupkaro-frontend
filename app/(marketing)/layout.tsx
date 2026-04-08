// app/(marketing)/layout.tsx

import { MarketingHeader } from "@/features/marketing/components/MarketingHeader";
import { MarketingFooter } from "@/features/marketing/components/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <MarketingHeader />
            <main className="flex-1">{children}</main>
            <MarketingFooter />
        </div>
    );
}
