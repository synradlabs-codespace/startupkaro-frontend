// features/marketing/components/ComingSoonPage.tsx

import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

export function ComingSoonPage({ title }: { title: string }) {
    return (
        <div className="flex-1 flex items-center justify-center px-6 py-24">
            <div className="text-center space-y-6 max-w-sm">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-lg bg-coral/10 flex items-center justify-center">
                        <Construction className="h-8 w-8 text-coral" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-display font-normal tracking-tight text-ink">{title}</h1>
                    <p className="font-sans text-base text-body-muted leading-relaxed">
                        This page is coming soon. We're working on it!
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 h-9 px-4 font-sans text-base text-ink border border-hairline rounded-lg hover:bg-soft-stone transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
