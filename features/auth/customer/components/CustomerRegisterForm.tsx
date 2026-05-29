"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useCustomerRegister } from "../hooks/useCustomerAuth";
import {
    formatNameInput, formatPhoneDigits,
    validateName, validateEmail, validatePassword, validateConfirmPassword, validatePhoneDigits, buildPhone,
    PHONE_PREFIX,
} from "@/lib/validation";

const FIELD_CLASS = "h-10 w-full rounded-md border bg-canvas px-4 text-sm text-ink placeholder:text-graphite outline-none transition-colors focus:border-ink";

export function CustomerRegisterForm() {
  const { register, loading, error } = useCustomerRegister();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneDigits, setPhoneDigits] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [apiError, setApiError] = useState<string | null>(null);

  const clearFieldError = (key: keyof typeof fieldErrors) =>
    setFieldErrors((f) => ({ ...f, [key]: "" }));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, name: formatNameInput(e.target.value) }));
    if (fieldErrors.name) clearFieldError("name");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, email: e.target.value }));
    if (fieldErrors.email) clearFieldError("email");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneDigits(formatPhoneDigits(e.target.value));
    if (fieldErrors.phone) clearFieldError("phone");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, password: e.target.value }));
    if (fieldErrors.password) clearFieldError("password");
    if (fieldErrors.confirm) clearFieldError("confirm");
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, confirm: e.target.value }));
    if (fieldErrors.confirm) clearFieldError("confirm");
  };

  const validate = () => {
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhoneDigits(phoneDigits, true),
      password: validatePassword(form.password),
      confirm: validateConfirmPassword(form.password, form.confirm),
    };
    setFieldErrors(errors);
    return Object.values(errors).every((e) => e === "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    await register({
      name: form.name.trim(),
      email: form.email,
      mobile: buildPhone(phoneDigits)!,
      password: form.password,
    });
  };

  const displayError = apiError || error;

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

                  {/* Name */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                      <User className="h-3.5 w-3.5" /> Full name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleNameChange}
                      required
                      autoComplete="name"
                      placeholder="Full Name"
                      className={`${FIELD_CLASS} ${fieldErrors.name ? "border-error-brand" : "border-hairline-strong"}`}
                    />
                    {fieldErrors.name
                      ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.name}</p>
                      : <p className="mt-1 text-xs text-graphite">Letters and spaces only</p>
                    }
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleEmailChange}
                      required
                      autoComplete="email"
                      placeholder="Email"
                      className={`${FIELD_CLASS} ${fieldErrors.email ? "border-error-brand" : "border-hairline-strong"}`}
                    />
                    {fieldErrors.email && <p className="mt-1 text-xs text-error-brand">{fieldErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                      <Phone className="h-3.5 w-3.5" /> Mobile
                    </label>
                    <div className={`flex items-center rounded-md border bg-canvas overflow-hidden focus-within:border-ink ${fieldErrors.phone ? "border-error-brand" : "border-hairline-strong"}`}>
                      <span className="px-3 py-2 text-sm text-ink bg-surface border-r border-hairline select-none shrink-0">{PHONE_PREFIX}</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phoneDigits}
                        onChange={handlePhoneChange}
                        placeholder="Number"
                        maxLength={10}
                        className="flex-1 px-3 py-2 text-sm text-ink bg-canvas outline-none placeholder:text-graphite h-10"
                      />
                    </div>
                    {fieldErrors.phone
                      ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.phone}</p>
                      : <p className="mt-1 text-xs text-graphite">10-digit number, no spaces</p>
                    }
                  </div>

                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Account security</p>
                <div className="grid gap-3 md:grid-cols-2">

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                      <LockKeyhole className="h-3.5 w-3.5" /> Create password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="new-password"
                        placeholder="Password"
                        className={`${FIELD_CLASS} pr-12 ${fieldErrors.password ? "border-error-brand" : "border-hairline-strong"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                    {fieldErrors.password
                      ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.password}</p>
                      : <p className="mt-1 text-xs text-graphite">At least 8 characters</p>
                    }
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                      <LockKeyhole className="h-3.5 w-3.5" /> Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={form.confirm}
                        onChange={handleConfirmChange}
                        required
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                        className={`${FIELD_CLASS} pr-12 ${fieldErrors.confirm ? "border-error-brand" : "border-hairline-strong"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep"
                      >
                        {showConfirm ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                    {fieldErrors.confirm && <p className="mt-1 text-xs text-error-brand">{fieldErrors.confirm}</p>}
                  </div>

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
