"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useCustomerResetPassword } from "../hooks/useCustomerAuth";

export function CustomerResetPasswordForm() {
  const { sendResetEmail, loading, error, sent } = useCustomerResetPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendResetEmail(email);
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
        <Link href="/customer/login" className="inline-flex items-center gap-2 text-xs text-stone hover:text-slate transition-colors mb-10 font-mono tracking-widest uppercase">
          ← Back to login
        </Link>

        <div className="border border-hairline rounded-2xl p-10 bg-canvas shadow-sm">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase font-mono mb-2 font-medium text-storm-deep">
              StartupKaro
            </p>
            <h1 className="text-4xl text-ink font-serif font-normal">Reset password</h1>
            <p className="mt-2 text-sm text-graphite font-sans">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="px-4 py-5 rounded-xl bg-tint-sky border border-primary-soft text-sm text-primary-brand font-sans leading-relaxed">
              ✓ Reset link sent. Check your inbox and follow the instructions.
            </div>
          ) : (
            <>
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
                    placeholder="you@example.com"
                    className="w-full bg-surface border border-hairline rounded-xl px-4 py-3 text-ink text-sm placeholder-gray-400 focus:outline-none focus:border-hairline-strong transition-colors font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-200 disabled:opacity-50 text-white bg-storm-deep"
                >
                  {loading ? "Sending..." : "Send reset link →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
