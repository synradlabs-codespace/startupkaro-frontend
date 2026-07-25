"use client";

import { FormEvent, useState } from "react";
import { Phone } from "lucide-react";
import { buildPhone, formatPhoneDigits, PHONE_PREFIX, validatePhoneDigits } from "@/lib/validation";

export function GooglePhoneCompletionForm({
    loading,
    onSubmit,
}: {
    loading: boolean;
    onSubmit: (phone: string) => Promise<void>;
}) {
    const [phoneDigits, setPhoneDigits] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const nextPhoneError = validatePhoneDigits(phoneDigits, true);
        const phone = buildPhone(phoneDigits);
        setPhoneError(nextPhoneError);
        if (nextPhoneError || !phone) return;
        await onSubmit(phone);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-primary-soft bg-tint-sky/40 p-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">Finish Google signup</p>
                <p className="mt-1 text-sm leading-relaxed text-charcoal">
                    Add your mobile number to finish creating the customer account.
                </p>
            </div>

            <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.7px] text-graphite">
                    <Phone className="h-3.5 w-3.5" /> Mobile
                </label>
                <div className={`flex items-center overflow-hidden rounded-md border bg-canvas focus-within:border-ink ${phoneError ? "border-error-brand" : "border-hairline-strong"}`}>
                    <span className="shrink-0 select-none border-r border-hairline bg-surface px-3 py-2 text-sm text-ink">{PHONE_PREFIX}</span>
                    <input
                        type="tel"
                        inputMode="numeric"
                        value={phoneDigits}
                        onChange={(e) => {
                            setPhoneDigits(formatPhoneDigits(e.target.value));
                            if (phoneError) setPhoneError("");
                        }}
                        placeholder="Number"
                        maxLength={10}
                        className="h-10 min-w-0 flex-1 bg-canvas px-3 py-2 text-sm text-ink outline-none placeholder:text-graphite"
                    />
                </div>
                {phoneError ? <p className="mt-1 text-xs text-error-brand">{phoneError}</p> : <p className="mt-1 text-xs text-graphite">10-digit number, no spaces</p>}
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
