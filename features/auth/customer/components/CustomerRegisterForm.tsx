"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
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

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma", autoComplete: "name" },
    { key: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
    { key: "mobile", label: "Mobile", type: "tel", placeholder: "+91 98765 43210", autoComplete: "tel" },
    { key: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
    { key: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
  ];

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-60" />

      <div className="absolute top-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-[var(--color-saffron)]" />
        <div className="flex-1 bg-white border-t border-gray-200" />
        <div className="flex-1 bg-[var(--color-green)]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-10 font-mono tracking-widest uppercase">
          ← Back
        </Link>

        <div className="border border-gray-200 rounded-2xl p-10 bg-white shadow-sm">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase font-mono mb-2 font-medium text-[var(--color-green)]">
              StartupKaro
            </p>
            <h1 className="text-4xl text-black font-serif font-normal">Create account</h1>
            <p className="mt-2 text-sm text-gray-500 font-sans">Join StartupKaro and explore our services.</p>
          </div>

          {displayError && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-sans">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, autoComplete }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-2 font-mono tracking-widest uppercase">
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-sans"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[var(--color-green)]"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link href="/customer/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-sans">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}