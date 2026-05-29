// lib/validations/common.schema.ts
// Shared client-side validation helpers, input formatters, and phone utils used across all panels.

// --- Phone constants & formatters ---

export const PHONE_PREFIX = "+91";

/** Strip everything except letters and spaces (used for name inputs). */
export function formatNameInput(raw: string): string {
    return raw.replace(/[^a-zA-Z\s]/g, "");
}

/** Strip non-digits and cap at 10 for the bare number after +91. */
export function formatPhoneDigits(raw: string): string {
    return raw.replace(/\D/g, "").slice(0, 10);
}

/** Compose the full phone string to send to the API. */
export function buildPhone(digits: string): string | undefined {
    return digits ? `${PHONE_PREFIX}${digits}` : undefined;
}

/** Validates the bare 10-digit number (without +91). Returns error string or "". */
export function validatePhoneDigits(digits: string, required = false): string {
    if (!digits) return required ? "Phone number is required" : "";
    if (digits.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
}

/** Returns an error string or null if valid. */
export const validators = {
    name: (v: string): string | null => {
        if (!v.trim()) return "Name is required";
        if (v.trim().length < 2) return "Name must be at least 2 characters";
        if (v.trim().length > 60) return "Name must be under 60 characters";
        return null;
    },

    email: (v: string): string | null => {
        if (!v.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()))
            return "Enter a valid email address";
        return null;
    },

    phone: (v: string): string | null => {
        if (!v.trim()) return "Phone number is required";
        // Allows optional leading +, digits, spaces, dashes, parens — 7–15 digit chars
        if (!/^[+]?[\d\s\-()+]{7,15}$/.test(v.trim()))
            return "Enter a valid phone number (e.g. +91 98765 43210)";
        return null;
    },

    password: (v: string): string | null => {
        if (!v) return "Password is required";
        if (v.length < 8) return "Must be at least 8 characters";
        return null;
    },

    confirmPassword: (v: string, original: string): string | null => {
        if (!v) return "Please confirm your password";
        if (v !== original) return "Passwords do not match";
        return null;
    },

    currentPassword: (v: string): string | null => {
        if (!v) return "Current password is required";
        return null;
    },
};

export interface PasswordStrength {
    score: number; // 0–5
    label: string;
    color: string; // Tailwind bg class
    textColor: string; // Tailwind text class
}

/** Scores a password from 0 (very weak) to 5 (very strong). */
export function getPasswordStrength(password: string): PasswordStrength {
    if (!password) return { score: 0, label: "", color: "bg-gray-200", textColor: "text-gray-400" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    if (score === 2) return { score, label: "Fair", color: "bg-orange-400", textColor: "text-orange-500" };
    if (score === 3) return { score, label: "Good", color: "bg-yellow-400", textColor: "text-yellow-600" };
    if (score === 4) return { score, label: "Strong", color: "bg-green-500", textColor: "text-green-600" };
    return { score, label: "Very Strong", color: "bg-emerald-600", textColor: "text-emerald-600" };
}
