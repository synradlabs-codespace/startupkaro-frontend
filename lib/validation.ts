// Re-export everything from the canonical validation module so callers can
// import from either path without duplication.
export {
    PHONE_PREFIX,
    formatNameInput,
    formatPhoneDigits,
    buildPhone,
    validatePhoneDigits,
} from "@/lib/validations/common.schema";

import { validators } from "@/lib/validations/common.schema";

// Adapt the null-returning validators to the empty-string convention used by
// the admin employee form and customer register form.
export const validateName = (v: string) => validators.name(v) ?? "";
export const validateEmail = (v: string) => validators.email(v) ?? "";
export const validatePassword = (v: string) => validators.password(v) ?? "";
export const validateConfirmPassword = (v: string, original: string) =>
    validators.confirmPassword(v, original) ?? "";
