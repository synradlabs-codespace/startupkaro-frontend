"use client";

import { FormEvent, useState } from "react";
import { Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneField } from "@/components/custom/PhoneField";
import {
    buildPhone,
    formatNameInput,
    validatePhoneDigits,
    collectErrors,
} from "@/lib/validation";
import { validators } from "@/lib/validations/common.schema";

/**
 * Minimal pre-auth step for Google sign-up/sign-in when the backend reports
 * `registration_required`. Google doesn't share a phone number, and its name
 * may not be the account holder's legal name, so both are confirmed here.
 *
 * This has to happen before the full profile/address form: address-related
 * endpoints (billing states, addresses) require an authenticated session,
 * which only exists after this step exchanges the registration token. Once
 * submitted, the user is authenticated and lands on the same
 * "complete your profile" form email sign-ups use, with name and phone
 * already prefilled from what's entered here.
 */
export function GoogleRegistrationStep({
    initialName = "",
    loading,
    onSubmit,
}: {
    initialName?: string;
    loading: boolean;
    onSubmit: (payload: { name: string; phone: string }) => Promise<void>;
}) {
    const [name, setName] = useState(initialName);
    const [phoneDigits, setPhoneDigits] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ name: "", phone: "" });

    const clearFieldError = (key: keyof typeof fieldErrors) =>
        setFieldErrors((f) => ({ ...f, [key]: "" }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { errors, isValid } = collectErrors({
            name: validators.name(name),
            phone: validatePhoneDigits(phoneDigits, true) || null,
        });
        setFieldErrors(errors);
        if (!isValid) return;

        const phone = buildPhone(phoneDigits);
        if (!phone) return;
        await onSubmit({ name: name.trim(), phone });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-primary-soft bg-tint-sky/40 p-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Finish Google signup</p>
                <p className="mt-1 text-sm leading-relaxed text-charcoal">
                    Confirm your name and add your mobile number to finish creating the customer account.
                </p>
            </div>

            <div>
                <Label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                    <User className="h-3.5 w-3.5" /> Full name
                </Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(formatNameInput(e.target.value)); clearFieldError("name"); }}
                    placeholder="Full Name"
                    className={`h-10 w-full ${fieldErrors.name ? "border-error-brand" : "border-hairline-strong"}`}
                />
                {fieldErrors.name
                    ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.name}</p>
                    : <p className="mt-1 text-xs text-graphite">From your Google account — change it if it isn&apos;t your legal name</p>
                }
            </div>

            <div>
                <Label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                    <Phone className="h-3.5 w-3.5" /> Mobile
                </Label>
                <PhoneField
                    value={phoneDigits}
                    onChange={(digits) => { setPhoneDigits(digits); clearFieldError("phone"); }}
                    error={!!fieldErrors.phone}
                />
                {fieldErrors.phone ? <p className="mt-1 text-xs text-error-brand">{fieldErrors.phone}</p> : <p className="mt-1 text-xs text-graphite">10-digit number, no spaces</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-md bg-primary-brand px-6 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:bg-hairline-strong"
            >
                {loading ? "Finishing..." : "Finish with Google"}
            </button>
        </form>
    );
}
