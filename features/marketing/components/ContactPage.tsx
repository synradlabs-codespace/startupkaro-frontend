// features/marketing/components/ContactPage.tsx

"use client";

import { useState, FormEvent } from "react";
import { validators } from "@/lib/validations/common.schema";
import { Send, Phone, Mail, MapPin } from "lucide-react";

interface FormState {
    fullName: string;
    email: string;
    phone: string;
    message: string;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    message?: string;
}

function getTodayDate() {
    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function ContactPage() {
    const [form, setForm] = useState<FormState>({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateIndianPhone = (v: string): string | null => {
        if (!v.trim()) return "Phone number is required";
        const stripped = v.trim().replace(/[\s\-()]/g, "");
        if (!/^(\+91)?[6-9]\d{9}$/.test(stripped))
            return "Enter a valid Indian mobile number (e.g. +91 98765 43210)";
        return null;
    };

    function validate(): FormErrors {
        return {
            fullName: validators.name(form.fullName) ?? undefined,
            email: validators.email(form.email) ?? undefined,
            phone: validateIndianPhone(form.phone) ?? undefined,
            message: form.message.trim().length < 10
                ? "Message must be at least 10 characters"
                : form.message.trim().length > 1000
                    ? "Message must be under 1000 characters"
                    : undefined,
        };
    }

    const handleChange = (field: keyof FormState) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errs = validate();
        const hasErrors = Object.values(errs).some(Boolean);
        if (hasErrors) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-canvas flex items-center justify-center px-6">
                <div className="w-full max-w-md text-center">
                    <div className="border border-hairline rounded-2xl p-10 bg-tint-mint">
                        <div className="h-14 w-14 rounded-full bg-white/60 flex items-center justify-center mx-auto mb-6">
                            <Send className="h-6 w-6 text-charcoal" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-ink mb-2">Message sent!</h2>
                        <p className="text-base text-slate leading-relaxed">
                            Thank you for reaching out. Our team will get back to you within 1 business day.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const inputBase = "w-full bg-surface border rounded-md px-4 py-3 text-ink text-sm placeholder-stone focus:outline-none focus:ring-2 focus:ring-primary-brand/20 transition-colors";
    const inputError = "border-error-brand focus:border-error-brand";
    const inputNormal = "border-hairline-strong focus:border-hairline-strong";

    return (
        <main className="min-h-screen bg-canvas flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Left — info panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28px] text-steel font-medium mb-2">
                                Get in touch
                            </p>
                            <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-ink leading-tight">
                                We&apos;d love to<br />hear from you
                            </h1>
                            <p className="mt-3 text-base text-slate leading-relaxed">
                                Have a question about our services? Need help choosing the right compliance package? Our experts are here to help.
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-md bg-tint-peach flex items-center justify-center shrink-0 mt-0.5">
                                    <Mail className="h-4 w-4 text-charcoal" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28px] text-stone font-medium mb-0.5">Email</p>
                                    <p className="text-sm text-ink">hello@startupkaro.in</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-md bg-tint-sky flex items-center justify-center shrink-0 mt-0.5">
                                    <Phone className="h-4 w-4 text-charcoal" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28px] text-stone font-medium mb-0.5">Phone</p>
                                    <p className="text-sm text-ink">+91 789 00000 88</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-md bg-tint-mint flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="h-4 w-4 text-charcoal" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.28px] text-stone font-medium mb-0.5">Office</p>
                                    <p className="text-sm text-ink">Mohali, Punjab, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="lg:col-span-3">
                        <div className="border border-hairline rounded-2xl p-8 bg-canvas">
                            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                                <div>
                                    <label className="block text-xs font-medium uppercase tracking-[0.28px] text-stone mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.fullName}
                                        onChange={handleChange("fullName")}
                                        placeholder="Rahul Sharma"
                                        autoComplete="name"
                                        className={`${inputBase} ${errors.fullName ? inputError : inputNormal}`}
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1.5 text-xs text-error-brand">{errors.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-medium uppercase tracking-[0.28px] text-stone mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange("email")}
                                        placeholder="rahul@company.com"
                                        autoComplete="email"
                                        className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs text-error-brand">{errors.email}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-[0.28px] text-stone mb-2">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange("phone")}
                                            placeholder="+91 98765 43210"
                                            autoComplete="tel"
                                            className={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1.5 text-xs text-error-brand">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-[0.28px] text-stone mb-2">
                                            Date of Submission
                                        </label>
                                        <input
                                            type="text"
                                            value={getTodayDate()}
                                            readOnly
                                            className="w-full bg-surface border border-hairline rounded-md px-4 py-3 text-stone text-sm cursor-default select-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium uppercase tracking-[0.28px] text-stone mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={form.message}
                                        onChange={handleChange("message")}
                                        placeholder="Tell us about your business and what you need help with…"
                                        rows={5}
                                        className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
                                    />
                                    <div className="flex items-start justify-between mt-1.5">
                                        {errors.message ? (
                                            <p className="text-xs text-error-brand">{errors.message}</p>
                                        ) : (
                                            <span />
                                        )}
                                        <p className="text-xs text-stone shrink-0 ml-2">
                                            {form.message.length}/1000
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-1 py-3 rounded-md text-xs font-medium tracking-[0.28px] uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-primary-brand hover:bg-primary-brand/90 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        "Sending…"
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
