import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-serif">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

      <div className="absolute top-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-[var(--color-saffron)]" />
        <div className="flex-1 bg-white border-t border-gray-200" />
        <div className="flex-1 bg-[var(--color-green)]" />
      </div>

      <div className="relative mb-16 text-center">
        <p className="text-xs tracking-[0.35em] text-gray-400 uppercase mb-4 font-mono">
          Welcome to
        </p>
        <h1 className="text-6xl md:text-8xl text-black font-normal tracking-tight leading-none">
          Startup<span className="text-[var(--color-saffron)]">Karo</span>
        </h1>
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-[var(--color-saffron)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-indigo)]" />
          <div className="h-px w-12 bg-[var(--color-green)]" />
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row gap-5 w-full max-w-3xl">
        <PortalCard href="/admin/login" label="Admin" description="Manage operations, teams & analytics" tag="01" accent="var(--color-saffron)" />
        <PortalCard href="/employee/login" label="Employee" description="Handle orders, customers & inquiries" tag="02" accent="var(--color-indigo)" />
        <PortalCard href="/customer/login" label="Customer" description="View purchases, services & invoices" tag="03" accent="var(--color-green)" />
      </div>

      <p className="relative mt-14 text-xs text-gray-400 tracking-widest uppercase font-mono">
        Select your portal to continue
      </p>
    </main>
  );
}

function PortalCard({ href, label, description, tag, accent }: {
  href: string;
  label: string;
  description: string;
  tag: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex-1 border border-gray-200 rounded-2xl p-8 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ backgroundColor: accent }}
      />
      <div className="relative">
        <span className="text-[10px] font-mono tracking-[0.25em] mb-6 block font-medium" style={{ color: accent }}>
          {tag}
        </span>
        <h2 className="text-3xl font-normal mb-3 text-black">{label}</h2>
        <p className="text-sm text-gray-500 leading-relaxed font-sans group-hover:text-gray-600 transition-colors">
          {description}
        </p>
        <div
          className="mt-8 text-xs font-mono tracking-widest flex items-center gap-2 transition-all duration-300 group-hover:gap-3 font-medium"
          style={{ color: accent }}
        >
          Enter <span className="text-base leading-none">→</span>
        </div>
      </div>
    </Link>
  );
}