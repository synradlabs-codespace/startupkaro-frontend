"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useCustomerRegister } from "../hooks/useCustomerAuth";

export function CustomerRegisterForm() {
  const { register, loading, error } = useCustomerRegister();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", password: "", confirm: "" });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (form.password !== form.confirm) {
      setValidationError("Passwords do not match");
      return;
    }
    await register({ name: form.name, email: form.email, mobile: form.mobile, password: form.password });
  };

  const displayError = validationError || error;

  const detailFields = [
    { key: "name", label: "Full name", type: "text", placeholder: "Rahul Sharma", autoComplete: "name", icon: User },
    { key: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email", icon: Mail },
    { key: "mobile", label: "Mobile", type: "tel", placeholder: "+91 98765 43210", autoComplete: "tel", icon: Phone },
  ] as const;

  const passwordFields = [
    { key: "password", label: "Create password", type: "password", placeholder: "Enter password", autoComplete: "new-password", icon: LockKeyhole },
    { key: "confirm", label: "Confirm password", type: "password", placeholder: "Re-enter password", autoComplete: "new-password", icon: LockKeyhole },
  ] as const;

  const renderField = ({ key, label, type, placeholder, autoComplete, icon: Icon }: (typeof detailFields | typeof passwordFields)[number]) => (
    <div key={key}>
      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-hairline-strong bg-canvas px-4 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center lg:max-w-6xl">
        <div className="grid w-full overflow-hidden rounded-xl border border-hairline bg-canvas lg:grid-cols-[1.25fr_0.75fr]">
          <section className="p-5 md:p-6">
            <div className="mb-5 border-b border-hairline pb-5">
              <div>
                <Link href="/customer/login" className="mb-4 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>

                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
                <h1 className="font-display text-4xl font-medium leading-none text-ink">Create your account</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite">
                  Set up a customer account to track purchases, manage profile details, and continue services without starting over.
                </p>
              </div>
            </div>

            {displayError && (
              <div className="mb-4 rounded-lg border border-bloom-deep bg-bloom-rose px-4 py-3 text-sm text-bloom-deep">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Your details</p>
                <div className="grid gap-3 md:grid-cols-3">
                  {detailFields.map(renderField)}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Account security</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {passwordFields.map(renderField)}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-hairline pt-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/customer/login" className="text-link-blue hover:text-primary-deep">
                Already have an account? Sign in
              </Link>
            </div>
          </section>

          <section className="hidden min-h-[320px] flex-col justify-between bg-surface p-5 md:p-6 lg:flex">
            <div className="space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary-soft bg-canvas">
                <FileCheck className="h-5 w-5 text-primary-brand" />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">First-time customer</p>
                <h2 className="font-display text-2xl font-medium leading-none text-ink">
                  One account for every service.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">
                  Use this profile to track purchases, contact details, and future StartupKaro orders.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-graphite">
                  Use the same email and mobile number you want associated with StartupKaro service updates.
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-sm text-charcoal">
              <div className="rounded-lg border border-hairline bg-canvas p-3">Track services and purchases</div>
              <div className="rounded-lg border border-hairline bg-canvas p-3">Reuse one profile for future orders</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
