// features/marketing/components/PortalSelectPage.tsx

import Link from "next/link";

function PortalCard({
    href,
    label,
    description,
    tag,
    tintClass,
}: {
    href: string;
    label: string;
    description: string;
    tag: string;
    tintClass: string;
}) {
    return (
        <Link
            href={href}
            className={`group relative flex-1 border border-hairline rounded-2xl p-8 ${tintClass} hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
        >
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="relative">
                <span className="text-xs font-medium uppercase tracking-[0.28px] text-stone mb-6 block">
                    {tag}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-3">{label}</h2>
                <p className="text-sm text-slate leading-relaxed group-hover:text-charcoal transition-colors">
                    {description}
                </p>
                <div className="mt-8 text-xs font-medium text-charcoal flex items-center gap-2 transition-all duration-300 group-hover:gap-3">
                    Enter <span className="text-base leading-none">→</span>
                </div>
            </div>
        </Link>
    );
}

export function PortalSelectPage() {
    return (
        <main className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6">
            <div className="mb-16 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.28px] text-stone mb-4">
                    Welcome to
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-ink leading-none">
                    Startup<span className="italic font-normal">Karo</span>
                </h1>
                <div className="mt-5 flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-tint-peach" />
                    <div className="w-2 h-2 rounded-full bg-tint-sky" />
                    <div className="h-px w-12 bg-tint-mint" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 w-full max-w-3xl">
                <PortalCard
                    href="/admin/login"
                    label="Admin"
                    description="Manage operations, teams & analytics"
                    tag="01"
                    tintClass="bg-tint-mint"
                />
                <PortalCard
                    href="/employee/login"
                    label="Employee"
                    description="Handle orders, customers & inquiries"
                    tag="02"
                    tintClass="bg-tint-sky"
                />
                <PortalCard
                    href="/customer/login"
                    label="Customer"
                    description="View purchases, services & invoices"
                    tag="03"
                    tintClass="bg-tint-peach"
                />
            </div>

            <p className="mt-14 text-xs font-medium uppercase tracking-[0.28px] text-stone">
                Select your portal to continue
            </p>
        </main>
    );
}
