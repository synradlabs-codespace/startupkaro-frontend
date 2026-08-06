"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/custom/PageHeader";
import { PhoneField } from "@/components/custom/PhoneField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { useToast } from "@/components/providers/ToastProvider";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { useCustomerAddresses, useCustomerAddressStates } from "@/features/customers/hooks/useCustomerAddresses";
import { customerAddressService, customerProfileService } from "@/services/customer.service";
import { formatCustomerDate, getApiErrorMessage, getInitials } from "@/features/customers/lib/format";
import { validators, formatNameInput } from "@/lib/validations/common.schema";
import {
    formatPostalCode,
    formatGstin,
    validatePhoneDigits,
    validateAddressLine1,
    validateCity,
    validateStateCode,
    validatePostalCode,
    validateGstin,
    mapServerFieldErrors,
    collectErrors,
    buildPhone,
} from "@/lib/validation";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Receipt,
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
    line1: string;
    line2: string;
    city: string;
    stateCode: string;
    postalCode: string;
    gstin: string;
}

type FieldErrors = Record<keyof FormState, string>;

const EMPTY_ERRORS: FieldErrors = {
    name: "", phone: "", line1: "", line2: "", city: "", stateCode: "", postalCode: "", gstin: "",
};

function digitsFromPhone(phone?: string) {
    if (!phone) return "";
    return phone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
}

const DISABLED_INPUT_CLASS = "h-10 rounded-md bg-surface text-graphite cursor-not-allowed border-hairline-strong";

export function CustomerProfilePage() {
    const profileQuery = useCustomerProfile();
    const addressesQuery = useCustomerAddresses();
    const statesQuery = useCustomerAddressStates();
    const toast = useToast();
    const queryClient = useQueryClient();

    const profile = profileQuery.data;
    const addresses = addressesQuery.data ?? [];
    const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
    const states = statesQuery.data ?? [];

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState<FormState | null>(null);
    const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS);
    const [apiError, setApiError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const isGoogleAccount = profile?.authProvider === "google";

    const form = draft ?? {
        name: profile?.name ?? "",
        phone: digitsFromPhone(profile?.phone ?? profile?.mobile),
        line1: defaultAddress?.line1 ?? "",
        line2: defaultAddress?.line2 ?? "",
        city: defaultAddress?.city ?? "",
        stateCode: defaultAddress?.stateCode ?? "",
        postalCode: defaultAddress?.postalCode ?? "",
        gstin: defaultAddress?.gstin ?? "",
    };

    const selectedState = states.find((s) => s.code === form.stateCode);

    const validate = (): boolean => {
        const { errors: next, isValid } = collectErrors({
            name: validators.name(form.name),
            phone: validatePhoneDigits(form.phone, true) || null,
            line1: validateAddressLine1(form.line1) || null,
            line2: null,
            city: validateCity(form.city) || null,
            stateCode: validateStateCode(form.stateCode) || null,
            postalCode: validatePostalCode(form.postalCode) || null,
            gstin: validateGstin(form.gstin, form.stateCode) || null,
        });
        setErrors(next);
        return isValid;
    };

    const handleEdit = () => {
        if (!profile) return;
        setDraft({
            name: profile.name,
            phone: digitsFromPhone(profile.phone ?? profile.mobile),
            line1: defaultAddress?.line1 ?? "",
            line2: defaultAddress?.line2 ?? "",
            city: defaultAddress?.city ?? "",
            stateCode: defaultAddress?.stateCode ?? "",
            postalCode: defaultAddress?.postalCode ?? "",
            gstin: defaultAddress?.gstin ?? "",
        });
        setErrors(EMPTY_ERRORS);
        setApiError("");
        setEditing(true);
    };

    const setDraftField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setDraft((prev) => ({ ...(prev ?? form), [key]: value }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    // Single combined save: profile (name/phone) and the default billing
    // address are edited together in one form, so they're saved together too
    // — calling the services directly (not the mutation hooks, which each
    // fire their own toast) keeps this to exactly one success/error toast.
    const handleSave = async () => {
        if (!validate()) return;
        setApiError("");
        setSubmitting(true);

        try {
            const phone = buildPhone(form.phone) ?? "";
            const nameChanged = profile && profile.name !== form.name.trim();
            const phoneChanged = profile && digitsFromPhone(profile.phone ?? profile.mobile) !== form.phone;
            if (nameChanged || phoneChanged) {
                await customerProfileService.update({ name: form.name.trim(), phone });
            }

            const addressPayload = {
                label: defaultAddress?.label || "Primary",
                legalName: form.name.trim(),
                line1: form.line1.trim(),
                line2: form.line2.trim() || undefined,
                city: form.city.trim(),
                stateCode: form.stateCode,
                postalCode: form.postalCode.trim(),
                country: "IN",
                gstin: form.gstin.trim() || undefined,
                isDefault: true,
            };

            if (defaultAddress) {
                await customerAddressService.update(defaultAddress.id, addressPayload);
            } else {
                await customerAddressService.create(addressPayload);
            }

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["customer", "profile"] }),
                queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] }),
            ]);

            toast.success("Profile updated");
            setDraft(null);
            setEditing(false);
        } catch (err: unknown) {
            const serverFieldErrors = mapServerFieldErrors(err);
            if (Object.keys(serverFieldErrors).length) {
                setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
            }
            const message = getApiErrorMessage(err, "Failed to update profile");
            setApiError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setDraft(null);
        setErrors(EMPTY_ERRORS);
        setApiError("");
        setEditing(false);
    };

    const field = (key: keyof FormState, formatter?: (raw: string) => string) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setDraftField(key, formatter ? formatter(e.target.value) : e.target.value);
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
                                    disabled={submitting}
                                    className="gap-1.5 bg-white text-primary-deep hover:bg-white/90 rounded-lg uppercase tracking-wide"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {submitting ? "Saving..." : "Save"}
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
                                        {...field("name", formatNameInput)}
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
                                    <PhoneField
                                        value={form.phone}
                                        onChange={(digits) => setDraftField("phone", digits)}
                                        error={!!errors.phone}
                                    />
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
                                    disabled={submitting}
                                    className="gap-1.5 bg-primary-brand hover:bg-primary-brand/90 text-white rounded-lg flex-1 uppercase tracking-wide"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {submitting ? "Saving..." : "Save Changes"}
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
                                <p className="text-xs text-stone">
                                    {isGoogleAccount
                                        ? "Password changes are managed by Google for this account"
                                        : "Keep your account secure with a strong password"}
                                </p>
                            </div>
                            {isGoogleAccount ? (
                                <span className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-hairline bg-canvas text-stone rounded-lg shrink-0">
                                    Google
                                </span>
                            ) : (
                                <Link
                                    href="/customer/profile/change-password"
                                    className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-lg transition-colors shrink-0"
                                >
                                    Change
                                </Link>
                            )}
                        </div>

                    </div>
                </div>

                <div className="rounded-lg border border-hairline bg-canvas p-6 flex flex-col gap-5">
                    <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                        <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                            <MapPin className="h-3.5 w-3.5 text-primary-brand" />
                        </div>
                        <h3 className="text-sm font-semibold text-charcoal">Billing Address</h3>
                    </div>

                    {editing ? (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">Address line 1</Label>
                                <Input
                                    {...field("line1")}
                                    placeholder="Flat / building / street"
                                    className={`h-10 rounded-md focus-visible:ring-0 focus:border-ink transition-colors ${errors.line1 ? "border-error-brand" : "border-hairline-strong"}`}
                                />
                                {errors.line1 && <p className="text-xs text-error-brand">{errors.line1}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-steel uppercase tracking-wide">
                                    Address line 2 <span className="normal-case text-stone">(optional)</span>
                                </Label>
                                <Input
                                    {...field("line2")}
                                    placeholder="Area / landmark"
                                    className="h-10 rounded-md focus-visible:ring-0 focus:border-ink transition-colors border-hairline-strong"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide">City</Label>
                                    <Input
                                        {...field("city")}
                                        placeholder="City"
                                        className={`h-10 rounded-md focus-visible:ring-0 focus:border-ink transition-colors ${errors.city ? "border-error-brand" : "border-hairline-strong"}`}
                                    />
                                    {errors.city && <p className="text-xs text-error-brand">{errors.city}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide">State</Label>
                                    <Combobox
                                        options={states.map((s) => ({ value: s.code, label: s.name }))}
                                        value={form.stateCode}
                                        onChange={(stateCode) => setDraftField("stateCode", stateCode)}
                                        placeholder="Select state"
                                        error={!!errors.stateCode}
                                        loading={statesQuery.isLoading}
                                    />
                                    {errors.stateCode && <p className="text-xs text-error-brand">{errors.stateCode}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide">PIN code</Label>
                                    <Input
                                        {...field("postalCode", formatPostalCode)}
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="6-digit PIN"
                                        className={`h-10 rounded-md focus-visible:ring-0 focus:border-ink transition-colors ${errors.postalCode ? "border-error-brand" : "border-hairline-strong"}`}
                                    />
                                    {errors.postalCode
                                        ? <p className="text-xs text-error-brand">{errors.postalCode}</p>
                                        : <p className="text-xs text-stone">6-digit PIN code</p>
                                    }
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide">Country</Label>
                                    <Input value="India" disabled className={DISABLED_INPUT_CLASS} />
                                    <p className="text-xs text-stone">Only Indian billing addresses are supported today</p>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                        <Receipt className="h-3 w-3" /> GSTIN <span className="normal-case text-stone">(optional)</span>
                                    </Label>
                                    <Input
                                        {...field("gstin", formatGstin)}
                                        maxLength={15}
                                        placeholder="15-character GSTIN"
                                        className={`h-10 rounded-md focus-visible:ring-0 focus:border-ink transition-colors ${errors.gstin ? "border-error-brand" : "border-hairline-strong"}`}
                                    />
                                    {errors.gstin
                                        ? <p className="text-xs text-error-brand">{errors.gstin}</p>
                                        : <p className="text-xs text-stone">
                                            Add it to receive GST invoices{selectedState ? ` for ${selectedState.name}` : ""}
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>
                    ) : defaultAddress ? (
                        <div className="space-y-1 text-sm text-slate">
                            <p className="font-medium text-ink">{defaultAddress.legalName}</p>
                            <p>{defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}</p>
                            <p>{defaultAddress.city}, {defaultAddress.stateName ?? defaultAddress.stateCode} {defaultAddress.postalCode}</p>
                            <p>India</p>
                            {defaultAddress.gstin && <p className="text-xs text-stone mt-1">GSTIN: {defaultAddress.gstin}</p>}
                        </div>
                    ) : (
                        <p className="text-sm text-stone">No billing address on file yet. Click Edit Profile to add one.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
