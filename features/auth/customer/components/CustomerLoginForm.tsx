"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useCustomerLogin } from "../hooks/useCustomerAuth";

export function CustomerLoginForm() {
    const { login, loading, error } = useCustomerLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <main className="min-h-screen bg-canvas flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

            <div className="absolute top-0 left-0 right-0 flex h-1">
                <div className="flex-1 bg-bloom-coral" />
                <div className="flex-1 bg-canvas border-t border-hairline" />
                <div className="flex-1 bg-storm-deep" />
            </div>

            <div className="relative w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs text-stone hover:text-slate transition-colors mb-10 font-mono tracking-widest uppercase"
                >
                    ← Back
                </Link>

                <div className="border border-hairline rounded-2xl p-10 bg-canvas shadow-sm">
                    <div className="mb-8">
                        <p className="text-xs tracking-[0.3em] uppercase font-mono mb-2 font-medium text-storm-deep">
                            StartupKaro
                        </p>
                        <h1 className="text-4xl text-ink font-serif font-normal">Welcome back</h1>
                        <p className="mt-2 text-sm text-graphite font-sans">
                            Sign in to your StartupKaro account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-sans">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs text-graphite mb-2 font-mono tracking-widest uppercase">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full bg-surface border border-hairline rounded-xl px-4 py-3 text-ink text-sm placeholder-gray-400 focus:outline-none focus:border-hairline-strong transition-colors font-sans"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-graphite mb-2 font-mono tracking-widest uppercase">
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
                                    className="w-full bg-surface border border-hairline rounded-xl px-4 py-3 text-ink text-sm placeholder-gray-400 focus:outline-none focus:border-hairline-strong transition-colors font-sans pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone hover:text-slate text-xs font-mono transition-colors"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-primary-brand"
                        >
                            {loading ? "Signing in..." : "Sign in →"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-hairline flex flex-col gap-2 items-center">
                        <Link href="/customer/register" className="text-xs text-stone hover:text-slate transition-colors font-sans">
                            Don&apos;t have an account? Register
                        </Link>
                        <Link href="/customer/reset-password" className="text-xs text-stone hover:text-slate transition-colors font-sans">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
