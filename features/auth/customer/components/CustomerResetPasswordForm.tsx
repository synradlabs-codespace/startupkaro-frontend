"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileCheck, LockKeyhole, Mail } from "lucide-react";
import { useCustomerResetPassword, useCustomerConfirmReset } from "../hooks/useCustomerAuth";

// ─── Step 1: request reset email ────────────────────────────────────────────

function ForgotPasswordStep() {
  const { sendResetEmail, loading, error, sent } = useCustomerResetPassword();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await sendResetEmail(email);
  };

  return (
    <>
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
                placeholder="Email"
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
    </>
  );
}

// ─── Step 2: set new password using token from email link ────────────────────

function SetNewPasswordStep({ token }: { token: string }) {
  const { confirmReset, loading, error, done } = useCustomerConfirmReset();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [matchError, setMatchError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMatchError("Passwords do not match");
      return;
    }
    setMatchError("");
    await confirmReset(token, password);
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
        <h1 className="font-display text-4xl font-medium leading-none text-ink md:text-5xl">Set new password</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-graphite">
          Choose a strong password for your account.
        </p>
      </div>

      {done ? (
        <div className="space-y-5">
          <div className="rounded-lg border border-primary-soft bg-tint-sky px-4 py-4 text-sm leading-relaxed text-primary-deep">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Password updated
            </div>
            Your password has been changed successfully. Sign in with your new credentials.
          </div>
          <Link
            href="/customer/login"
            className="flex h-11 w-full items-center justify-center rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <>
          {(error || matchError) && (
            <div className="mb-6 rounded-lg border border-bloom-deep bg-bloom-rose px-4 py-3 text-sm text-bloom-deep">
              {matchError || error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                <LockKeyhole className="h-3.5 w-3.5" />
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="New password"
                  className="h-11 w-full rounded-md border border-hairline-strong bg-canvas px-4 pr-16 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                <LockKeyhole className="h-3.5 w-3.5" />
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Confirm password"
                className="h-11 w-full rounded-md border border-hairline-strong bg-canvas px-4 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </>
      )}
    </>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────

export function CustomerResetPasswordForm({ token }: { token?: string }) {
  return (
    <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center lg:min-h-[calc(100vh-4rem)] lg:max-w-6xl">
        <div className="grid w-full overflow-hidden rounded-xl border border-hairline bg-canvas lg:grid-cols-[1.05fr_0.95fr]">
          <section className="p-5 sm:p-6 md:p-10">
            <Link href="/customer/login" className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep md:mb-8">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>

            {token ? <SetNewPasswordStep token={token} /> : <ForgotPasswordStep />}
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
