"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, Phone, Receipt, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import { PhoneField } from "@/components/custom/PhoneField";
import { useToast } from "@/components/providers/ToastProvider";
import { useCustomerProfile } from "@/features/customers/hooks/useCustomerProfile";
import { useCustomerAddressStates } from "@/features/customers/hooks/useCustomerAddresses";
import { customerAddressService, customerProfileService } from "@/services/customer.service";
import { getApiErrorMessage } from "@/lib/api-messages";
import { getSafeRoleNext } from "@/features/auth/shared/hooks/useAuthRedirect";
import {
    buildPhone,
    collectErrors,
    formatGstin,
    formatNameInput,
    formatPostalCode,
    mapServerFieldErrors,
    validateAddressLine1,
    validateCity,
    validateGstin,
    validateName,
    validatePhoneDigits,
    validatePostalCode,
    validateStateCode,
} from "@/lib/validation";

const FIELD_CLASS = "h-10 w-full";

type FormState = {
    name: string;
    phoneDigits: string;
    line1: string;
    line2: string;
    city: string;
    stateCode: string;
    postalCode: string;
    gstin: string;
};

const EMPTY_FORM: FormState = {
    name: "",
    phoneDigits: "",
    line1: "",
    line2: "",
    city: "",
    stateCode: "",
    postalCode: "",
    gstin: "",
};

function digitsFromPhone(phone?: string) {
    if (!phone) return "";
    return phone.replace(/^\+91/, "").replace(/\D/g, "").slice(0, 10);
}

export function CompleteProfilePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();
    const queryClient = useQueryClient();
    const profileQuery = useCustomerProfile();
    const statesQuery = useCustomerAddressStates();

    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [prefilled, setPrefilled] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<keyof FormState, string>>({
        name: "", phoneDigits: "", line1: "", line2: "", city: "", stateCode: "", postalCode: "", gstin: "",
    });
    const [submitting, setSubmitting] = useState(false);

    // Prefill once: email sign-ups already have name/phone from signup, Google
    // sign-ups have them from the pre-auth exchange step. Only run once so we
    // never clobber what the user is actively typing.
    useEffect(() => {
        if (prefilled || !profileQuery.data) return;
        const profile = profileQuery.data;
        setForm((f) => ({
            ...f,
            name: profile.name ?? f.name,
            phoneDigits: digitsFromPhone(profile.phone ?? profile.mobile) || f.phoneDigits,
        }));
        setPrefilled(true);
    }, [prefilled, profileQuery.data]);

    const clearFieldError = (key: keyof FormState) =>
        setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

    const setField = (key: keyof FormState, value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
        clearFieldError(key);
    };

    const states = statesQuery.data ?? [];
    const selectedState = states.find((s) => s.code === form.stateCode);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { errors, isValid } = collectErrors({
            name: validateName(form.name) || null,
            phoneDigits: validatePhoneDigits(form.phoneDigits, true) || null,
            line1: validateAddressLine1(form.line1) || null,
            line2: null,
            city: validateCity(form.city) || null,
            stateCode: validateStateCode(form.stateCode) || null,
            postalCode: validatePostalCode(form.postalCode) || null,
            gstin: validateGstin(form.gstin, form.stateCode) || null,
        });
        setFieldErrors(errors);
        if (!isValid) {
            toast.error("Fix the highlighted fields before continuing");
            return;
        }

        const phone = buildPhone(form.phoneDigits);
        const profile = profileQuery.data;
        setSubmitting(true);
        try {
            const nameChanged = profile && profile.name !== form.name.trim();
            const phoneChanged = profile && digitsFromPhone(profile.phone ?? profile.mobile) !== form.phoneDigits;
            if (nameChanged || phoneChanged) {
                await customerProfileService.update({ name: form.name.trim(), phone: phone ?? "" });
            }

            await customerAddressService.create({
                label: "Primary",
                legalName: form.name.trim(),
                line1: form.line1.trim(),
                line2: form.line2.trim() || undefined,
                city: form.city.trim(),
                stateCode: form.stateCode,
                postalCode: form.postalCode.trim(),
                country: "IN",
                gstin: form.gstin.trim() || undefined,
                isDefault: true,
            });

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["customer", "profile"] }),
                queryClient.invalidateQueries({ queryKey: ["customer", "addresses"] }),
            ]);

            toast.success("Profile completed");
            const safeNext = getSafeRoleNext("customer", searchParams.get("next"));
            router.replace(safeNext ?? "/customer");
        } catch (err) {
            const serverFieldErrors = mapServerFieldErrors(err);
            if (Object.keys(serverFieldErrors).length) {
                setFieldErrors((prev) => ({
                    ...prev,
                    line1: serverFieldErrors.line1 ?? prev.line1,
                    city: serverFieldErrors.city ?? prev.city,
                    stateCode: serverFieldErrors.stateCode ?? prev.stateCode,
                    postalCode: serverFieldErrors.postalCode ?? prev.postalCode,
                    gstin: serverFieldErrors.gstin ?? prev.gstin,
                }));
            }
            toast.error(getApiErrorMessage(err, "Failed to save your profile"));
        } finally {
            setSubmitting(false);
        }
    };

    if (profileQuery.isLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-cloud px-4 py-4">
                <p className="text-sm text-graphite">Loading your account...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-cloud px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md items-center md:max-w-2xl">
                <div className="w-full overflow-hidden rounded-xl border border-hairline bg-canvas p-5 sm:p-6 md:p-10">
                    <div className="mb-6 border-b border-hairline pb-5 md:mb-8">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">StartupKaro</p>
                        <h1 className="font-display text-3xl font-medium leading-none text-ink">Complete your profile</h1>
                        <p className="mt-3 text-sm leading-relaxed text-graphite">
                            We need a few more details before you can start ordering services — your contact
                            information and a billing address for invoices.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">
                                <User className="h-3.5 w-3.5" /> Your details
                            </p>
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">Full name</Label>
                                    <Input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setField("name", formatNameInput(e.target.value))}
                                        placeholder="Full Name"
                                        className={`${FIELD_CLASS} ${fieldErrors.name ? "border-error-brand" : "border-hairline-strong"}`}
                                    />
                                    {fieldErrors.name
                                        ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.name}</p>
                                        : <p className="mt-1 text-xs text-graphite">As it will appear on invoices and documents</p>
                                    }
                                </div>

                                <div>
                                    <Label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                                        <Phone className="h-3.5 w-3.5" /> Mobile
                                    </Label>
                                    <PhoneField
                                        value={form.phoneDigits}
                                        onChange={(digits) => setField("phoneDigits", digits)}
                                        error={!!fieldErrors.phoneDigits}
                                    />
                                    {fieldErrors.phoneDigits
                                        ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.phoneDigits}</p>
                                        : <p className="mt-1 text-xs text-graphite">10-digit number, no spaces</p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 border-t border-hairline pt-5">
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">
                                <MapPin className="h-3.5 w-3.5" /> Billing address
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">Address line 1</Label>
                                    <Input
                                        type="text"
                                        value={form.line1}
                                        onChange={(e) => setField("line1", e.target.value)}
                                        placeholder="Flat / building / street"
                                        className={`${FIELD_CLASS} ${fieldErrors.line1 ? "border-error-brand" : "border-hairline-strong"}`}
                                    />
                                    {fieldErrors.line1 && <p className="mt-1 text-xs text-error-brand">{fieldErrors.line1}</p>}
                                </div>

                                <div>
                                    <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">Address line 2 <span className="normal-case text-graphite/70">(optional)</span></Label>
                                    <Input
                                        type="text"
                                        value={form.line2}
                                        onChange={(e) => setField("line2", e.target.value)}
                                        placeholder="Area / landmark"
                                        className={`${FIELD_CLASS} border-hairline-strong`}
                                    />
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    <div>
                                        <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">City</Label>
                                        <Input
                                            type="text"
                                            value={form.city}
                                            onChange={(e) => setField("city", e.target.value)}
                                            placeholder="City"
                                            className={`${FIELD_CLASS} ${fieldErrors.city ? "border-error-brand" : "border-hairline-strong"}`}
                                        />
                                        {fieldErrors.city && <p className="mt-1 text-xs text-error-brand">{fieldErrors.city}</p>}
                                    </div>

                                    <div>
                                        <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">State</Label>
                                        <Combobox
                                            options={states.map((state) => ({ value: state.code, label: state.name }))}
                                            value={form.stateCode}
                                            onChange={(stateCode) => setField("stateCode", stateCode)}
                                            placeholder="Select state"
                                            error={!!fieldErrors.stateCode}
                                            loading={statesQuery.isLoading}
                                        />
                                        {fieldErrors.stateCode && <p className="mt-1 text-xs text-error-brand">{fieldErrors.stateCode}</p>}
                                    </div>

                                    <div>
                                        <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">PIN code</Label>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            value={form.postalCode}
                                            onChange={(e) => setField("postalCode", formatPostalCode(e.target.value))}
                                            placeholder="6-digit PIN"
                                            maxLength={6}
                                            className={`${FIELD_CLASS} ${fieldErrors.postalCode ? "border-error-brand" : "border-hairline-strong"}`}
                                        />
                                        {fieldErrors.postalCode
                                            ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.postalCode}</p>
                                            : <p className="mt-1 text-xs text-graphite">6-digit PIN code</p>
                                        }
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                        <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.7px] text-graphite">Country</Label>
                                        <Input
                                            type="text"
                                            value="India"
                                            disabled
                                            className={`${FIELD_CLASS} cursor-not-allowed bg-surface border-hairline-strong text-graphite`}
                                        />
                                        <p className="mt-1 text-xs text-graphite">Only Indian billing addresses are supported today</p>
                                    </div>

                                    <div>
                                        <Label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                                            <Receipt className="h-3.5 w-3.5" /> GSTIN <span className="normal-case text-graphite/70">(optional)</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={form.gstin}
                                            onChange={(e) => setField("gstin", formatGstin(e.target.value))}
                                            placeholder="15-character GSTIN"
                                            maxLength={15}
                                            className={`${FIELD_CLASS} ${fieldErrors.gstin ? "border-error-brand" : "border-hairline-strong"}`}
                                        />
                                        {fieldErrors.gstin
                                            ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.gstin}</p>
                                            : <p className="mt-1 text-xs text-graphite">
                                                Add it to receive GST invoices{selectedState ? ` for ${selectedState.name}` : ""}
                                            </p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center border-t border-hairline pt-5">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="h-11 w-full max-w-100 rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
                            >
                                {submitting ? "Saving..." : "Save and continue"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
