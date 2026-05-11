// features/marketing/components/PortalSelectPage.tsx
// Relocated from app/page.tsx — renders identically, now at /login.

import Link from "next/link";

function PortalCard({
    href,
    label,
    description,
    tag,
    accent,
}: {
    href: string;
    label: string;
    description: string;
    tag: string;
    accent: string;
}) {
    return (
        <Link
            href={href}
            className="group relative flex-1 border border-hairline rounded-lg p-8 bg-white hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: accent }}
            />
            <div className="relative">
                <span
                    className="font-mono text-xs uppercase tracking-[0.28px] mb-6 block"
                    style={{ color: accent }}
                >
                    {tag}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-normal tracking-tight text-ink mb-3">{label}</h2>
                <p className="font-sans text-base text-body-muted leading-relaxed group-hover:text-ink transition-colors">
                    {description}
                </p>
                <div
                    className="mt-8 font-mono text-xs uppercase tracking-[0.28px] flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                    style={{ color: accent }}
                >
                    Enter <span className="text-base leading-none">→</span>
                </div>
            </div>
        </Link>
    );
}

export function PortalSelectPage() {
    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

            <div className="absolute top-0 left-0 right-0 flex h-1">
                <div className="flex-1 bg-[var(--color-saffron)]" />
                <div className="flex-1 bg-white border-t border-hairline" />
                <div className="flex-1 bg-[var(--color-green)]" />
            </div>

            <div className="relative mb-16 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.28px] text-body-muted mb-4">
                    Welcome to
                </p>
                <h1 className="font-display text-4xl md:text-6xl font-normal tracking-tight text-ink leading-none">
                    Startup<span className="text-coral">Karo</span>
                </h1>
                <div className="mt-5 flex items-center justify-center gap-2">
                    <div className="h-px w-12 bg-coral" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-indigo)]" />
                    <div className="h-px w-12 bg-deep-green" />
                </div>
            </div>

            <div className="relative flex flex-col md:flex-row gap-5 w-full max-w-3xl">
                <PortalCard
                    href="/admin/login"
                    label="Admin"
                    description="Manage operations, teams & analytics"
                    tag="01"
                    accent="var(--color-saffron)"
                />
                <PortalCard
                    href="/employee/login"
                    label="Employee"
                    description="Handle orders, customers & inquiries"
                    tag="02"
                    accent="var(--color-indigo)"
                />
                <PortalCard
                    href="/customer/login"
                    label="Customer"
                    description="View purchases, services & invoices"
                    tag="03"
                    accent="var(--color-green)"
                />
            </div>

            <p className="relative mt-14 font-mono text-xs uppercase tracking-[0.28px] text-body-muted">
                Select your portal to continue
            </p>
        </main>
    );
}
