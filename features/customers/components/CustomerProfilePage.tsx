"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerProfile, useUpdateCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { formatCustomerDate, getApiErrorMessage, getInitials } from "@/features/customers/lib/format";
import { validators, formatNameInput } from "@/lib/validations/common.schema";
import { formatPhoneDigits, validatePhoneDigits, buildPhone, PHONE_PREFIX } from "@/lib/validation";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Pencil,
    X,
    Check,
    ShieldCheck,
    KeyRound,
    BadgeCheck,
    Lock,
} from "lucide-react";

interface FormState {
    name: string;
    phone: string;
}

interface FieldErrors {
    name?: string;
    phone?: string;
}

export function CustomerProfilePage() {
    const profileQuery = useCustomerProfile();
    const updateProfile = useUpdateCustomerProfile();
    const profile = profileQuery.data;
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<FormState | null>(null);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [apiError, setApiError] = useState("");

    const form = draft ?? {
        name: profile?.name ?? "",
        phone: profile?.phone ?? profile?.mobile ?? "",
    };

    const validate = (): boolean => {
        const next: FieldErrors = {
            name: validators.name(form.name) ?? undefined,
            phone: validatePhoneDigits(form.phone, true) || undefined,
        };
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleEdit = () => {
        if (!profile) return;
        const rawPhone = profile.phone ?? profile.mobile ?? "";
        const digits = rawPhone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
        setDraft({ name: profile.name, phone: digits });
        setErrors({});
        setApiError("");
        setEditing(true);
    };

    const handleSave = async () => {
        if (!validate()) return;
        setApiError("");

        try {
            await updateProfile.mutateAsync({ name: form.name, phone: buildPhone(form.phone) ?? "" });
            setDraft(null);
            setEditing(false);
        } catch (err: unknown) {
            setApiError(getApiErrorMessage(err, "Failed to update profile"));
        }
    };

    const handleCancel = () => {
        setDraft(null);
        setErrors({});
        setApiError("");
        setEditing(false);
    };

    const field = (key: keyof FormState) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = key === "name" ? formatNameInput(e.target.value) : e.target.value;
            setDraft((prev) => ({ ...(prev ?? form), [key]: value }));
            if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
        },
    });

    if (profileQuery.isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <PageHeader title="My Profile" description="Manage your personal information and account security" />
                <div className="p-6 text-sm text-slate">Loading profile...</div>
            </div>
        );
    }

    if (profileQuery.isError || !profile) {
        return (
            <div className="flex flex-col min-h-screen">
                <PageHeader title="My Profile" description="Manage your personal information and account security" />
                <div className="p-6 text-sm text-error-brand">Failed to load profile</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="My Profile"
                description="Manage your personal information and account security"
                action={
                    !editing ? (
                        <Button
                            size="sm"
                            onClick={handleEdit}
                            className="gap-2 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg uppercase tracking-wide"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit Profile
                        </Button>
                    ) : undefined
                }
            />

            <div className="flex-1 p-6 space-y-6">
                <div className="rounded-xl bg-primary-brand px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full ring-2 ring-white/60 ring-offset-2 ring-offset-primary-brand bg-white flex items-center justify-center shrink-0">
                            <span className="text-lg font-semibold text-primary-deep">
                                {getInitials(profile.name)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-white">{profile.name}</h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white mt-1">
                                <BadgeCheck className="h-3 w-3" />
                                Customer
                            </span>
                        </div>

                        {editing && (
                            <div className="flex gap-2 shrink-0">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={updateProfile.isPending}
                                    className="gap-1.5 bg-white text-primary-deep hover:bg-white/90 rounded-lg uppercase tracking-wide"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {updateProfile.isPending ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-lg bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white uppercase tracking-wide"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-lg border border-hairline bg-canvas p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Personal Information</h3>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </Label>
                            {editing ? (
                                <div className="space-y-1">
                                    <Input
                                        {...field("name")}
                                        placeholder="Full Name"
                                        className={`h-10 rounded-md focus-visible:ring-0 focus:border-ink transition-colors ${errors.name ? "border-error-brand" : "border-hairline-strong"}`}
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

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone Number
                            </Label>
                            {editing ? (
                                <div className="space-y-1">
                                    <div className={`flex items-center rounded-md border bg-canvas overflow-hidden focus-within:border-ink transition-colors ${errors.phone ? "border-error-brand" : "border-hairline-strong"}`}>
                                        <span className="px-3 h-10 flex items-center text-sm text-ink bg-surface border-r border-hairline select-none shrink-0">{PHONE_PREFIX}</span>
                                        <input
                                            type="tel"
                                            inputMode="numeric"
                                            value={form.phone}
                                            onChange={(e) => {
                                                const digits = formatPhoneDigits(e.target.value);
                                                setDraft((prev) => ({ ...(prev ?? form), phone: digits }));
                                                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                                            }}
                                            placeholder="10-digit number"
                                            maxLength={10}
                                            className="flex-1 px-3 h-10 text-sm text-ink bg-canvas outline-none placeholder:text-graphite"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-xs text-error-brand">{errors.phone}</p>}
                                </div>
                            ) : (
                                <p className="text-sm text-slate">{profile.phone ?? profile.mobile ?? "-"}</p>
                            )}
                        </div>

                        {apiError && <p className="text-sm text-error-brand">{apiError}</p>}

                        {editing && (
                            <div className="flex gap-2 pt-2 lg:hidden">
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={updateProfile.isPending}
                                    className="gap-1.5 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg flex-1 uppercase tracking-wide"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleCancel}
                                    className="gap-1.5 rounded-lg uppercase tracking-wide"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Cancel
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-hairline bg-canvas p-6 flex flex-col gap-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Account &amp; Security</h3>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                            <Calendar className="h-4 w-4 text-stone mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-steel font-medium">Member Since</p>
                                <p className="text-sm text-charcoal font-medium">{formatCustomerDate(profile.createdAt)}</p>
                            </div>
                        </div>

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

                    </div>
                </div>
            </div>
        </div>
    );
}
