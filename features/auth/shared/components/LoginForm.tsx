// features/auth/shared/components/LoginForm.tsx

"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        <main className="min-h-screen bg-surface flex items-center justify-center px-6">
            <div className="relative w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-graphite hover:text-ink transition-colors mb-8"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                </Link>

                <div className="bg-canvas rounded-[22px] p-8 md:p-10 border border-hairline">
                    <div className="mb-8">
                        <p
                            className="font-mono text-xs uppercase tracking-[0.28px] mb-2"
                            style={{ color: accentColor }}
                        >
                            StartupKaro
                        </p>
                        <h1 className="font-display text-3xl font-normal tracking-tight text-ink">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-graphite">
                            {subtitle}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="Email"
                                className="w-full bg-surface border border-hairline rounded-lg px-4 py-3 text-ink text-sm placeholder:text-graphite focus:outline-none focus:border-ink transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="w-full bg-surface border border-hairline rounded-lg px-4 py-3 text-ink text-sm placeholder:text-graphite focus:outline-none focus:border-ink transition-colors pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-graphite hover:text-ink transition-colors"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 rounded-full bg-ink text-white text-sm font-medium transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {bottomLinks.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-hairline flex flex-wrap gap-4 justify-center">
                            {bottomLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-xs text-graphite hover:text-ink transition-colors"
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
