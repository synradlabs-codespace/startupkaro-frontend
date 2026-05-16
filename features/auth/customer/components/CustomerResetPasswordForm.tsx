"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileCheck, Mail } from "lucide-react";
import { useCustomerResetPassword } from "../hooks/useCustomerAuth";

export function CustomerResetPasswordForm() {
  const { sendResetEmail, loading, error, sent } = useCustomerResetPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendResetEmail(email);
  };

  return (
    <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center lg:min-h-[calc(100vh-4rem)] lg:max-w-6xl">
        <div className="grid w-full overflow-hidden rounded-xl border border-hairline bg-canvas lg:grid-cols-[1.05fr_0.95fr]">
          <section className="p-5 sm:p-6 md:p-10">
            <Link href="/customer/login" className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep md:mb-8">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>

            <div className="mb-6 md:mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
              <h1 className="font-display text-4xl font-medium leading-none text-ink md:text-5xl">Reset password</h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-graphite">
                Enter the email linked to your customer account. We will send a secure reset link if the account exists.
              </p>
            </div>

            {sent ? (
              <div className="space-y-5">
                <div className="rounded-lg border border-primary-soft bg-tint-sky px-4 py-4 text-sm leading-relaxed text-primary-deep">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Reset link sent
                  </div>
                  Check your inbox for the next step. If it does not arrive soon, check spam or try again with the email used at checkout.
                </div>
                <Link
                  href="/customer/login"
                  className="flex h-11 w-full items-center justify-center rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep"
                >
                  Return to sign in
                </Link>
              </div>
            ) : (
              <>
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
                      placeholder="you@example.com"
                      className="h-11 w-full rounded-md border border-hairline-strong bg-canvas px-4 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
                  >
                    {loading ? "Sending..." : "Send reset link"}
                  </button>
                </form>
              </>
            )}
          </section>

          <section className="hidden min-h-[360px] flex-col justify-between bg-surface p-8 md:p-10 lg:flex">
            <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-soft bg-canvas">
                <FileCheck className="h-6 w-6 text-primary-brand" />
              </div>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Account recovery</p>
                <h2 className="font-display text-3xl font-medium leading-none text-ink">
                  Use the email you used for StartupKaro services.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-charcoal">
                  For most customers, this is the same email used while placing an order or sharing documents with our team.
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-charcoal">
              <div className="rounded-lg border border-hairline bg-canvas p-4">Reset links are sent to verified email inboxes</div>
              <div className="rounded-lg border border-hairline bg-canvas p-4">You can return to sign in once the password is changed</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
