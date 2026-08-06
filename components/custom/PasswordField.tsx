"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Password input with a show/hide toggle, previously duplicated across
 * AdminLoginForm, EmployeeLoginForm, CustomerLoginForm, CustomerRegisterForm,
 * and CustomerResetPasswordForm. `toggleLabels` lets callers match their
 * original casing ("Show"/"Hide" vs "SHOW"/"HIDE") to keep the visual diff
 * minimal where it matters.
 */
export function PasswordField({
    value,
    onChange,
    error = false,
    id,
    placeholder,
    autoComplete,
    required,
    className,
    toggleLabels = ["Show", "Hide"],
}: {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    id?: string;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    className?: string;
    toggleLabels?: [shown: string, hidden: string];
}) {
    const [visible, setVisible] = useState(false);
    const [showLabel, hideLabel] = toggleLabels;

    return (
        <div className="relative">
            <Input
                id={id}
                type={visible ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                className={cn(
                    "h-10 pr-16",
                    error ? "border-error-brand" : "border-hairline-strong",
                    className
                )}
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.7px] text-link-blue hover:text-primary-deep"
            >
                {visible ? hideLabel : showLabel}
            </button>
        </div>
    );
}
