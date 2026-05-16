// features/customers/components/CustomerProfilePage.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validators } from "@/lib/validations/common.schema";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Camera,
    Pencil,
    X,
    Check,
    ShieldCheck,
    KeyRound,
    BadgeCheck,
    Lock,
} from "lucide-react";

const mockProfile = {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    joined: "January 15, 2025",
    initials: "RS",
};

interface FormState {
    name: string;
    phone: string;
}

interface FieldErrors {
    name?: string;
    phone?: string;
}

export function CustomerProfilePage() {
    const [profile, setProfile] = useState(mockProfile);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<FormState>({
        name: profile.name,
        phone: profile.phone,
    });
    const [errors, setErrors] = useState<FieldErrors>({});

    const validate = (): boolean => {
        const next: FieldErrors = {
            name: validators.name(form.name) ?? undefined,
            phone: validators.phone(form.phone) ?? undefined,
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSave = () => {
        if (!validate()) return;
        setProfile((prev) => ({ ...prev, ...form }));
        setEditing(false);
    };

    const handleCancel = () => {
        setForm({ name: profile.name, phone: profile.phone });
        setErrors({});
        setEditing(false);
    };

    const field = (key: keyof FormState) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [key]: e.target.value }));
            if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        },
    });

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="My Profile"
                description="Manage your personal information and account security"
                action={
                    !editing ? (
                        <Button
                            size="sm"
                            onClick={() => setEditing(true)}
                            className="gap-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg "
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Card ───────────────────────────── */}
                <div className="rounded-xl bg-primary-brand p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 rounded-full ring-2 ring-white/60 ring-offset-2 ring-offset-primary-brand bg-white flex items-center justify-center">
                                <span className="text-2xl font-semibold text-primary-deep">
                                    {profile.initials}
                                </span>
                            </div>
                            {editing && (
                                <button
                                    type="button"
                                    title="Upload photo"
                                    className="absolute bottom-0 right-0 h-7 w-7 rounded-md bg-primary-brand text-white flex items-center justify-center hover:bg-primary-brand/90 transition-colors"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white">
                                    <BadgeCheck className="h-3 w-3" />
                                    Customer
                                </span>
                            </div>
                            <p className="text-sm text-white/80 flex items-center justify-center sm:justify-start gap-1.5">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {profile.email}
                            </p>
                            <p className="mt-2 text-xs text-white/70 flex items-center justify-center sm:justify-start gap-1.5">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                Member since {profile.joined}
                            </p>
                        </div>

                        {/* Edit actions (desktop) */}
                        {editing && (
                            <div className="flex gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="gap-1.5 bg-white text-primary-deep hover:bg-white/90 rounded-lg"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-lg bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Content Grid ────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal Information */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Personal Information</h3>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </Label>
                            {editing ? (
                                <div className="space-y-1">
                                    <Input
                                        {...field("name")}
                                        placeholder="Your full name"
                                        className={`rounded-lg border-hairline focus-visible:ring-primary-brand/20 ${errors.name ? "border-error-brand" : ""}`}
                                    />
                                    {errors.name
                                        ? <p className="text-xs text-error-brand">{errors.name}</p>
                                        : <p className="text-xs text-stone">As it will appear on invoices and documents</p>
                                    }
                                </div>
                            ) : (
                                <p className="text-sm font-medium text-ink">{profile.name}</p>
                            )}
                        </div>

                        {/* Email — always read-only */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Email Address
                            </Label>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-slate">{profile.email}</p>
                                {editing && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-stone bg-surface rounded-full px-2 py-0.5">
                                        <Lock className="h-2.5 w-2.5" /> cannot be changed
                                    </span>
                                )}
                            </div>
                            {editing && (
                                <p className="text-xs text-stone">Email is your primary account identifier and cannot be edited.</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="mt-auto space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone Number
                            </Label>
                            {editing ? (
                                <div className="space-y-1">
                                    <Input
                                        {...field("phone")}
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className={`rounded-lg border-hairline focus-visible:ring-primary-brand/20 ${errors.phone ? "border-error-brand" : ""}`}
                                    />
                                    {errors.phone
                                        ? <p className="text-xs text-error-brand">{errors.phone}</p>
                                        : <p className="text-xs text-stone">Include country code (e.g. +91)</p>
                                    }
                                </div>
                            ) : (
                                <p className="text-sm text-slate">{profile.phone}</p>
                            )}
                        </div>

                        {/* Save / Cancel — mobile */}
                        {editing && (
                            <div className="flex gap-2 pt-2 lg:hidden">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="gap-1.5 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg flex-1"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Save Changes
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-lg"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Account & Security */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Account &amp; Security</h3>
                        </div>

                        {/* Joined */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                            <Calendar className="h-4 w-4 text-stone mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-steel font-medium">Member Since</p>
                                <p className="text-sm text-charcoal font-medium">{profile.joined}</p>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-hairline bg-surface">
                            <div className="h-9 w-9 rounded-lg bg-primary-brand/10 flex items-center justify-center shrink-0">
                                <KeyRound className="h-4 w-4 text-primary-brand" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal">Password</p>
                                <p className="text-xs text-stone">Keep your account secure with a strong password</p>
                            </div>
                            <Link
                                href="/customer/profile/change-password"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-lg transition-colors shrink-0"
                            >
                                Change
                            </Link>
                        </div>

                        {/* Security tip */}
                        <div className="mt-auto rounded-lg bg-primary-brand/10 border border-primary-brand/20 p-3 flex gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-primary-brand shrink-0 mt-0.5" />
                            <p className="text-xs text-slate leading-relaxed">
                                Use a strong, unique password and never share it. We will never ask for your password via email or phone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
