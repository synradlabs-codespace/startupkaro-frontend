"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, LockKeyhole, Mail } from "lucide-react";
import { useCustomerLogin } from "../hooks/useCustomerAuth";
import { validators } from "@/lib/validations/common.schema";

export function CustomerLoginForm() {
  const { login, loading, error } = useCustomerLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const clearFieldError = (key: keyof typeof fieldErrors) =>
    setFieldErrors((f) => ({ ...f, [key]: "" }));

  const validate = () => {
    const errors = {
      email: validators.email(email) ?? "",
      password: !password ? "Password is required" : "",
    };
    setFieldErrors(errors);
    return Object.values(errors).every((e) => e === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await login(email, password);
  };

  return (
    <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center lg:min-h-[calc(100vh-3rem)] lg:max-w-6xl">
        <div className="grid w-full overflow-hidden rounded-xl border border-hairline bg-canvas lg:grid-cols-[1.05fr_0.95fr]">
          <section className="p-5 sm:p-6 md:p-8">
            <Link href="/" className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>

            <div className="mb-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
              <h1 className="font-display text-4xl font-medium leading-none text-ink">Welcome back</h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-graphite">
                Continue your registrations, compliance work, purchases, and profile updates.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-bloom-deep bg-bloom-rose px-4 py-3 text-sm text-bloom-deep">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className={`h-10 w-full rounded-md border bg-canvas px-4 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink ${fieldErrors.email ? "border-error-brand" : "border-hairline-strong"}`}
                />
                {fieldErrors.email && <p className="mt-1 text-xs text-error-brand">{fieldErrors.email}</p>}
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
                    onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    className={`h-10 w-full rounded-md border bg-canvas px-4 pr-16 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink ${fieldErrors.password ? "border-error-brand" : "border-hairline-strong"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {fieldErrors.password && <p className="mt-1 text-xs text-error-brand">{fieldErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <Link href="/customer/reset-password" className="block text-center text-sm text-graphite hover:text-ink">
                Forgot password?
              </Link>
            </form>

            <div className="mt-5 flex flex-col gap-3 border-t border-hairline pt-5 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.7px] text-graphite">New to StartupKaro?</p>
              <Link
                href="/customer/register"
                className="flex h-11 w-full items-center justify-center rounded-md border border-primary-brand bg-canvas px-6 text-sm font-semibold uppercase tracking-[0.7px] text-primary-brand transition-colors hover:bg-surface hover:text-primary-deep"
              >
                Create a customer account
              </Link>
            </div>
          </section>

          <section className="hidden min-h-[320px] flex-col justify-between bg-surface p-6 md:p-8 lg:flex">
            <div className="space-y-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-soft bg-canvas">
                <FileCheck className="h-6 w-6 text-primary-brand" />
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Customer workspace</p>
                <h2 className="font-display text-3xl font-medium leading-none text-ink">
                  Your business services in one place.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">
                  Track purchased services, manage account details, and return to ongoing compliance tasks without searching through emails.
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-charcoal">
              <div className="rounded-lg border border-hairline bg-canvas p-4">Order and purchase history</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
