// features/marketing/components/ComingSoonPage.tsx

import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

export function ComingSoonPage({ title }: { title: string }) {
    return (
        <div className="flex-1 flex items-center justify-center px-6 py-24">
            <div className="text-center space-y-6 max-w-sm">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-xl bg-electric-blue flex items-center justify-center">
                        <Construction className="h-8 w-8 text-white" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink">{title}</h1>
                    <p className="text-base text-slate leading-relaxed">
                        This page is coming soon. We&apos;re working on it!
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm text-charcoal border border-hairline rounded-md hover:bg-surface transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
