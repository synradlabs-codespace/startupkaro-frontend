"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PHONE_PREFIX, formatPhoneDigits } from "@/lib/validation";

/**
 * The "+91" prefixed phone input, previously duplicated verbatim across
 * CustomerRegisterForm, GoogleRegistrationStep, CustomerProfilePage,
 * AdminEmployeeNewPage, and others. `value`/`onChange` deal in the bare
 * 10-digit number — callers still use `buildPhone()` from lib/validation to
 * compose the full "+91XXXXXXXXXX" string for submission.
 */
export function PhoneField({
    value,
    onChange,
    error = false,
    id,
    placeholder = "Number",
    className,
}: {
    value: string;
    onChange: (digits: string) => void;
    error?: boolean;
    id?: string;
    placeholder?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex h-10 items-center overflow-hidden rounded-md border bg-canvas transition-colors focus-within:border-ring",
                error ? "border-error-brand" : "border-hairline-strong",
                className
            )}
        >
            <span className="shrink-0 select-none border-r border-hairline bg-surface px-3 py-2 text-sm text-ink">
                {PHONE_PREFIX}
            </span>
            <Input
                id={id}
                type="tel"
                inputMode="numeric"
                value={value}
                onChange={(e) => onChange(formatPhoneDigits(e.target.value))}
                placeholder={placeholder}
                maxLength={10}
                className="h-full flex-1 rounded-none border-0 bg-transparent px-3 shadow-none outline-none focus-visible:ring-0"
            />
        </div>
    );
}
