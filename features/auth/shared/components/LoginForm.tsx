// features/auth/shared/components/LoginForm.tsx

"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface LoginFormProps {
    title: string;
    subtitle: string;
    accentColor: string;
    onSubmit: (email: string, password: string) => Promise<void>;
    loading: boolean;
    error: string | null;
    bottomLinks?: { label: string; href: string }[];
}

export function LoginForm({
    title,
    subtitle,
    accentColor,
    onSubmit,
    loading,
    error,
    bottomLinks = [],
}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(email, password);
    };

    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

            {/* Tricolor top bar */}
            <div className="absolute top-0 left-0 right-0 flex h-1">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white border-t border-gray-200" />
                <div className="flex-1 bg-[#6BAE3A]" />
            </div>

            <div className="relative w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-10 font-['DM_Mono',monospace] tracking-widest uppercase"
                >
                    ← Back
                </Link>

                <div className="border border-gray-200 rounded-2xl p-10 bg-white shadow-sm">
                    <div className="mb-8">
                        <p
                            className="text-xs tracking-[0.3em] uppercase font-['DM_Mono',monospace] mb-2 font-medium"
                            style={{ color: accentColor }}
                        >
                            StartupKaro
                        </p>
                        <h1 className="text-4xl text-black font-['Instrument_Serif',serif] font-normal">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 font-['DM_Sans',sans-serif]">
                            {subtitle}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-['DM_Sans',sans-serif]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 font-['DM_Mono',monospace] tracking-widest uppercase">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-['DM_Sans',sans-serif]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-2 font-['DM_Mono',monospace] tracking-widest uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-['DM_Sans',sans-serif] pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-['DM_Mono',monospace] transition-colors"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 rounded-xl text-sm font-['DM_Mono',monospace] tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                            style={{ backgroundColor: accentColor }}
                        >
                            {loading ? "Signing in..." : "Sign in →"}
                        </button>
                    </form>

                    {bottomLinks.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 justify-center">
                            {bottomLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-['DM_Sans',sans-serif]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}