"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAdminLogin } from "../hooks/useAdminAuth";


export function AdminLoginForm() {
  const { login, loading, error } = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

      <div className="absolute top-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-[var(--color-saffron)]" />
        <div className="flex-1 bg-white border-t border-gray-200" />
        <div className="flex-1 bg-[var(--color-green)]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-10 font-mono tracking-widest uppercase"
        >
          ← Back
        </Link>

        <div className="border border-gray-200 rounded-2xl p-10 bg-white shadow-sm">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase font-mono mb-2 font-medium text-[var(--color-saffron)]">
              StartupKaro
            </p>
            <h1 className="text-4xl text-black font-serif font-normal">Admin Portal</h1>
            <p className="mt-2 text-sm text-gray-500 font-sans">
              Sign in with your admin credentials to continue.
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-mono tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@startupkaro.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2 font-mono tracking-widest uppercase">
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-sans pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-mono transition-colors"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[var(--color-saffron)]"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}