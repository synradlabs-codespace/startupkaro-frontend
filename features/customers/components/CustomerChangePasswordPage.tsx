// features/customers/components/CustomerChangePasswordPage.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validators, getPasswordStrength } from "@/lib/validations/common.schema";
import {
    KeyRound,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowLeft,
    Check,
    Info,
} from "lucide-react";

interface FormState {
    current: string;
    next: string;
    confirm: string;
}

interface FieldErrors {
    current?: string;
    next?: string;
    confirm?: string;
}

export function CustomerChangePasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormState>({ current: "", next: "", confirm: "" });
    const [errors, setErrors] = useState<FieldErrors>({});
    const [show, setShow] = useState({ current: false, next: false, confirm: false });
    const [submitted, setSubmitted] = useState(false);

    const strength = getPasswordStrength(form.next);

    const validate = (): boolean => {
        const next: FieldErrors = {
            current: validators.currentPassword(form.current) ?? undefined,
            next: validators.password(form.next) ?? undefined,
            confirm: validators.confirmPassword(form.confirm, form.next) ?? undefined,
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        // TODO: call API when ready
        setSubmitted(true);
        setTimeout(() => router.push("/customer/profile"), 1800);
    };

    const field = (key: keyof FormState) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [key]: e.target.value }));
            if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        },
    });

    const toggleShow = (key: keyof typeof show) =>
        setShow((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="Change Password"
                description="Update your account password to keep it secure"
                action={
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/customer/profile")}
                        className="gap-1.5 text-gray-500 hover:text-gray-800 rounded-xl"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Profile
                    </Button>
                }
            />

            <div className="flex-1 p-6">
                <div className="max-w-2xl space-y-6">

                    {/* ── Success state ─────────────────────────── */}
                    {submitted && (
                        <div className="rounded-2xl border border-[#FF9933]/20 bg-[#FF9933]/5 p-6 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#FF9933] flex items-center justify-center shrink-0 shadow">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Password updated successfully</p>
                                <p className="text-xs text-gray-500">Redirecting you back to your profile…</p>
                            </div>
                        </div>
                    )}

                    {/* ── Form card ─────────────────────────────── */}
                    {!submitted && (
                        <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                            {/* Card header */}
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/60 to-white flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <KeyRound className="h-4 w-4 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Update Password</p>
                                    <p className="text-xs text-gray-400">Choose a strong password you haven't used before</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">

                                {/* Current password */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            {...field("current")}
                                            type={show.current ? "text" : "password"}
                                            placeholder="Enter your current password"
                                            className={`rounded-xl pr-10 border-gray-200 focus-visible:ring-[#FF9933]/30 ${errors.current ? "border-red-400" : ""}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow("current")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {show.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.current && (
                                        <p className="text-xs text-red-500">{errors.current}</p>
                                    )}
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* New password */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            {...field("next")}
                                            type={show.next ? "text" : "password"}
                                            placeholder="Create a strong new password"
                                            className={`rounded-xl pr-10 border-gray-200 focus-visible:ring-[#FF9933]/30 ${errors.next ? "border-red-400" : ""}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow("next")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {show.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    {/* Strength meter */}
                                    {form.next && (
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength.score ? strength.color : "bg-gray-200"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className={`text-xs font-medium ${strength.textColor}`}>
                                                {strength.label}
                                            </p>
                                        </div>
                                    )}

                                    {errors.next
                                        ? <p className="text-xs text-red-500">{errors.next}</p>
                                        : (
                                            <div className="flex gap-1.5 items-start text-xs text-gray-400 pt-0.5">
                                                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                                                <span>Min 8 chars, include one uppercase letter and one number</span>
                                            </div>
                                        )
                                    }
                                </div>

                                {/* Confirm password */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            {...field("confirm")}
                                            type={show.confirm ? "text" : "password"}
                                            placeholder="Re-enter your new password"
                                            className={`rounded-xl pr-10 border-gray-200 focus-visible:ring-[#FF9933]/30 ${errors.confirm ? "border-red-400" : ""}`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow("confirm")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {show.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>

                                        {/* Match indicator */}
                                        {form.confirm && form.next && !errors.confirm && (
                                            <div className="absolute right-9 top-1/2 -translate-y-1/2">
                                                <Check className="h-4 w-4 text-[#FF9933]" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.confirm && (
                                        <p className="text-xs text-red-500">{errors.confirm}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        className="gap-2 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white rounded-xl px-6"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        Update Password
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/customer/profile")}
                                        className="rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ── Tips card ─────────────────────────────── */}
                    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 backdrop-blur-sm p-5 space-y-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5" /> Password Tips
                        </p>
                        <ul className="space-y-1.5">
                            {[
                                "Use at least 8 characters",
                                "Mix uppercase letters, numbers, and symbols",
                                "Avoid your name, birthday, or common words",
                                "Don't reuse passwords from other sites",
                            ].map((tip) => (
                                <li key={tip} className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF9933]/50 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
