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
                            className="gap-2 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white rounded-xl shadow-sm"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Card ───────────────────────────── */}
                <div className="relative overflow-hidden rounded-2xl border border-[#FF9933]/15 bg-gradient-to-br from-[#FF9933]/8 via-white/80 to-orange-50/60 backdrop-blur-sm shadow-sm p-8">
                    {/* decorative blobs */}
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#FF9933]/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-orange-300/10 blur-2xl" />

                    <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#FF9933]/20 to-orange-200/40 border-2 border-[#FF9933]/20 flex items-center justify-center shadow-inner">
                                <span className="text-2xl font-semibold text-[#FF9933]">
                                    {profile.initials}
                                </span>
                            </div>
                            {editing && (
                                <button
                                    type="button"
                                    title="Upload photo"
                                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#FF9933] text-white flex items-center justify-center shadow-md hover:bg-[#FF9933]/90 transition-colors"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#FF9933]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#d4720a]">
                                    <BadgeCheck className="h-3 w-3" />
                                    Customer
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {profile.email}
                            </p>
                            <p className="mt-2 text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
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
                                    className="gap-1.5 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white rounded-xl"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-xl"
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
                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                            <div className="h-7 w-7 rounded-lg bg-[#FF9933]/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-[#FF9933]" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">Personal Information</h3>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </Label>
                            {editing ? (
                                <div className="space-y-1">
                                    <Input
                                        {...field("name")}
                                        placeholder="Your full name"
                                        className={`rounded-xl border-gray-200 focus-visible:ring-[#FF9933]/30 ${errors.name ? "border-red-400" : ""}`}
                                    />
                                    {errors.name
                                        ? <p className="text-xs text-red-500">{errors.name}</p>
                                        : <p className="text-xs text-gray-400">As it will appear on invoices and documents</p>
                                    }
                                </div>
                            ) : (
                                <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                            )}
                        </div>

                        {/* Email — always read-only */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Email Address
                            </Label>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-700">{profile.email}</p>
                                {editing && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                                        <Lock className="h-2.5 w-2.5" /> cannot be changed
                                    </span>
                                )}
                            </div>
                            {editing && (
                                <p className="text-xs text-gray-400">Email is your primary account identifier and cannot be edited.</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone Number
                            </Label>
                            {editing ? (
                                <div className="space-y-1">
                                    <Input
                                        {...field("phone")}
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className={`rounded-xl border-gray-200 focus-visible:ring-[#FF9933]/30 ${errors.phone ? "border-red-400" : ""}`}
                                    />
                                    {errors.phone
                                        ? <p className="text-xs text-red-500">{errors.phone}</p>
                                        : <p className="text-xs text-gray-400">Include country code (e.g. +91)</p>
                                    }
                                </div>
                            ) : (
                                <p className="text-sm text-gray-700">{profile.phone}</p>
                            )}
                        </div>

                        {/* Save / Cancel — mobile */}
                        {editing && (
                            <div className="flex gap-2 pt-2 lg:hidden">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="gap-1.5 bg-[#FF9933] hover:bg-[#FF9933]/90 text-white rounded-xl flex-1"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Save Changes
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-xl"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Account & Security */}
                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">Account &amp; Security</h3>
                        </div>

                        {/* Joined */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Member Since</p>
                                <p className="text-sm text-gray-800 font-medium">{profile.joined}</p>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                            <div className="h-9 w-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                <KeyRound className="h-4 w-4 text-[#FF9933]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">Password</p>
                                <p className="text-xs text-gray-400">Keep your account secure with a strong password</p>
                            </div>
                            <Link
                                href="/customer/profile/change-password"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
                            >
                                Change
                            </Link>
                        </div>

                        {/* Security tip */}
                        <div className="rounded-xl bg-[#FF9933]/5 border border-[#FF9933]/10 p-3 flex gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-[#FF9933] shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Use a strong, unique password and never share it. We will never ask for your password via email or phone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
