"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";
import { useEmployeeLogin } from "../hooks/useEmployeeAuth";

export function EmployeeLoginForm() {
  const { login, loading, error } = useEmployeeLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center lg:min-h-[calc(100vh-4rem)] lg:max-w-6xl">
        <div className="grid w-full overflow-hidden rounded-xl border border-hairline bg-canvas lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden min-h-[390px] flex-col justify-between bg-surface p-8 md:p-10 lg:flex">
            <Link href="/" className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>

            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-soft bg-canvas">
                <BriefcaseBusiness className="h-6 w-6 text-primary-brand" />
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Employee desk</p>
                <h1 className="font-display text-4xl font-medium leading-none text-ink md:text-5xl">
                  Pick up the next customer task.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal">
                  Access assigned orders, customer details, and inquiries with a focused workflow built for daily operations.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-charcoal sm:grid-cols-2">
              <div className="rounded-lg border border-hairline bg-canvas p-4">Order updates</div>
              <div className="rounded-lg border border-hairline bg-canvas p-4">Inquiry follow-ups</div>
            </div>
          </section>

          <section className="p-5 sm:p-6 md:p-10">
            <Link href="/" className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep lg:hidden">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>

            <div className="mb-6 md:mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
              <h2 className="font-display text-3xl font-medium leading-none text-ink">Employee sign in</h2>
              <p className="mt-3 text-sm leading-relaxed text-graphite">
                Use the credentials provided by your admin to open your work panel.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-bloom-deep bg-bloom-rose px-4 py-3 text-sm text-bloom-deep">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@startupkaro.com"
                  className="h-11 w-full rounded-md border border-hairline-strong bg-canvas px-4 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="h-11 w-full rounded-md border border-hairline-strong bg-canvas px-4 pr-16 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
