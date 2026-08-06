// app/(marketing)/layout.tsx

import { MarketingHeader } from "@/features/marketing/components/MarketingHeader";
import { MarketingFooter } from "@/features/marketing/components/MarketingFooter";
import { WhatsAppButton } from "@/components/custom/WhatsAppButton";
import { CookieConsentBanner } from "@/components/custom/CookieConsentBanner";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <PostHogProvider>
            <ToastProvider>
                <div className="flex flex-col min-h-screen">
                    <MarketingHeader />
                    <main className="flex-1 pt-24">{children}</main>
                    <MarketingFooter />
                    <WhatsAppButton />
                    <CookieConsentBanner />
                </div>
            </ToastProvider>
        </PostHogProvider>
    );
}
