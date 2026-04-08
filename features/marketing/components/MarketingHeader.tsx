// features/marketing/components/MarketingHeader.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-8">

                    {/* Logo */}
                    <Link href="/" className="shrink-0 font-serif text-2xl tracking-tight text-gray-900">
                        Startup<span className="text-[#FF9933]">Karo</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="inline-flex items-center h-9 px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/services"
                            className="inline-flex items-center h-9 px-4 text-sm font-medium text-white bg-[#FF9933] rounded-xl hover:bg-[#FF9933]/90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-2 flex flex-col gap-2">
                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center h-9 px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/services"
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-center h-9 px-4 text-sm font-medium text-white bg-[#FF9933] rounded-xl hover:bg-[#FF9933]/90 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
