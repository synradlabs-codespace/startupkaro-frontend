// features/marketing/components/ContactPage.tsx

"use client";

import { useRef, useState, FormEvent } from "react";
import { validators } from "@/lib/validations/common.schema";
import { GripHorizontal, Mail, MapPin, Minus, Phone, Plus, Send } from "lucide-react";

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

const MESSAGE_MIN_HEIGHT = 140;
const MESSAGE_MAX_HEIGHT = 300;
const MESSAGE_RESIZE_STEP = 32;

function getTodayDate() {
    return new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function ContactPage() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [form, setForm] = useState<FormState>({
        fullName: "",
        email: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageHeight, setMessageHeight] = useState(MESSAGE_MIN_HEIGHT);

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

    const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        const startY = event.clientY;
        const startHeight = textareaRef.current?.offsetHeight ?? messageHeight;

        const handlePointerMove = (moveEvent: PointerEvent) => {
            const nextHeight = Math.min(MESSAGE_MAX_HEIGHT, Math.max(MESSAGE_MIN_HEIGHT, startHeight + moveEvent.clientY - startY));
            setMessageHeight(nextHeight);
        };

        const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
    };

    const adjustMessageHeight = (delta: number) => {
        setMessageHeight((height) => Math.min(MESSAGE_MAX_HEIGHT, Math.max(MESSAGE_MIN_HEIGHT, height + delta)));
    };

    if (submitted) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-canvas px-6">
                <div className="w-full max-w-md text-center">
                    <div className="rounded-2xl border border-hairline bg-canvas p-10 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft">
                            <Send className="h-6 w-6 text-primary-brand" />
                        </div>
                        <h2 className="mb-2 font-display text-2xl font-medium text-ink md:text-3xl">Message sent!</h2>
                        <p className="text-base leading-relaxed text-charcoal">
                            Thank you for reaching out. Our team will get back to you within 1 business day.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const inputBase = "w-full bg-canvas border rounded-md px-4 py-2.5 text-ink text-sm placeholder-graphite focus:outline-none focus:ring-2 focus:ring-primary-brand/20 transition-colors";
    const inputError = "border-error-brand focus:border-error-brand";
    const inputNormal = "border-hairline-strong focus:border-hairline-strong";

    return (
        <main className="bg-canvas px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto w-full max-w-6xl">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">

                    {/* Left — info panel */}
                    <div className="space-y-5 lg:col-span-2">
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                                Get in touch
                            </p>
                            <h1 className="font-display text-4xl font-medium leading-none text-ink lg:text-5xl">
                                We&apos;d love to<br />hear from you
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-charcoal lg:text-base">
                                Have a question about our services? Need help choosing the right compliance package? Our experts are here to help.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas p-3.5 transition-colors duration-200 hover:border-primary-brand">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft">
                                    <Mail className="h-4 w-4 text-primary-brand" />
                                </div>
                                <div>
                                    <p className="mb-0.5 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Email</p>
                                    <p className="text-sm text-ink">hello@startupkaro.in</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas p-3.5 transition-colors duration-200 hover:border-primary-brand">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft">
                                    <Phone className="h-4 w-4 text-primary-brand" />
                                </div>
                                <div>
                                    <p className="mb-0.5 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Phone</p>
                                    <p className="text-sm text-ink">+91 789 00000 88</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl border border-hairline bg-canvas p-3.5 transition-colors duration-200 hover:border-primary-brand">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft">
                                    <MapPin className="h-4 w-4 text-primary-brand" />
                                </div>
                                <div>
                                    <p className="mb-0.5 text-xs font-medium uppercase tracking-[0.28px] text-graphite">Office</p>
                                    <p className="text-sm text-ink">Mohali, Punjab, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-hairline bg-cloud p-5 md:p-6">
                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                                <div>
                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">
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
                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">
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

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">
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
                                        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                                            Date of Submission
                                        </label>
                                        <input
                                            type="text"
                                            value={getTodayDate()}
                                            readOnly
                                            className="w-full cursor-default select-none rounded-md border border-hairline bg-canvas px-4 py-2.5 text-sm text-graphite"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium uppercase tracking-[0.28px] text-graphite">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            ref={textareaRef}
                                            value={form.message}
                                            onChange={handleChange("message")}
                                            placeholder="Tell us about your business and what you need help with..."
                                            rows={4}
                                            style={{ height: messageHeight }}
                                            className={`${inputBase} resize-none pb-14 ${errors.message ? inputError : inputNormal}`}
                                        />
                                        <div className="absolute bottom-2 left-1/2 flex h-11 -translate-x-1/2 items-center rounded-md border border-hairline-strong bg-canvas text-graphite shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                                            <button
                                                type="button"
                                                aria-label="Reduce message box height"
                                                onClick={() => adjustMessageHeight(-MESSAGE_RESIZE_STEP)}
                                                className="flex h-11 w-11 items-center justify-center rounded-l-md transition-colors hover:bg-surface hover:text-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand/20"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Drag to resize message box"
                                                title="Drag to resize"
                                                onPointerDown={handleResizeStart}
                                                onKeyDown={(event) => {
                                                    if (event.key === "ArrowUp") {
                                                        event.preventDefault();
                                                        adjustMessageHeight(-MESSAGE_RESIZE_STEP);
                                                    }
                                                    if (event.key === "ArrowDown") {
                                                        event.preventDefault();
                                                        adjustMessageHeight(MESSAGE_RESIZE_STEP);
                                                    }
                                                }}
                                                className="flex h-11 w-14 touch-none items-center justify-center border-x border-hairline-strong transition-colors hover:bg-surface hover:text-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand/20"
                                            >
                                                <GripHorizontal className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Increase message box height"
                                                onClick={() => adjustMessageHeight(MESSAGE_RESIZE_STEP)}
                                                className="flex h-11 w-11 items-center justify-center rounded-r-md transition-colors hover:bg-surface hover:text-primary-brand focus:outline-none focus:ring-2 focus:ring-primary-brand/20"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-start justify-between mt-1.5">
                                        {errors.message ? (
                                            <p className="text-xs text-error-brand">{errors.message}</p>
                                        ) : (
                                            <span />
                                        )}
                                        <p className="ml-2 shrink-0 text-xs text-graphite">
                                            {form.message.length}/1000
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-primary-brand py-3 text-xs font-medium uppercase tracking-[0.28px] text-white transition-all duration-200 hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50"
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
