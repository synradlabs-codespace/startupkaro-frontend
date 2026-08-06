type ApiErrorDetail = { field?: string; message?: string };

export function getResponseData(value: unknown): unknown {
    if (!value || typeof value !== "object") return null;
    const maybeResponse = value as { response?: { data?: unknown }; data?: unknown };
    return maybeResponse.response?.data ?? maybeResponse.data ?? null;
}

function getMessageFromData(data: unknown): string | null {
    if (!data || typeof data !== "object") return null;
    const message = (data as { message?: unknown }).message;
    return typeof message === "string" && message.trim() ? message.trim() : null;
}

function getValidationDetails(data: unknown): string {
    if (!data || typeof data !== "object") return "";

    const errors = (data as { errors?: unknown }).errors;
    if (Array.isArray(errors)) {
        return errors
            .map((item) => {
                const detail = item as ApiErrorDetail;
                if (detail.field && detail.message) return `${detail.field}: ${detail.message}`;
                return detail.message;
            })
            .filter(Boolean)
            .slice(0, 3)
            .join("; ");
    }

    if (errors && typeof errors === "object") {
        return Object.entries(errors as Record<string, unknown>)
            .flatMap(([field, messages]) => {
                if (Array.isArray(messages)) return messages.map((message) => `${field}: ${message}`);
                if (typeof messages === "string") return [`${field}: ${messages}`];
                return [];
            })
            .slice(0, 3)
            .join("; ");
    }

    return "";
}

export function getApiErrorMessage(error: unknown, fallback: string) {
    const data = getResponseData(error);
    const message = getMessageFromData(data) ?? (error instanceof Error ? error.message : fallback);
    const details = getValidationDetails(data);
    if (!details) return message || fallback;
    return `${message || fallback}: ${details}`;
}

/** Maps a validation error response's `errors: [{ field, message }]` onto a
 * flat `{ field: message }` map, so server-side field errors (e.g. GSTIN/state
 * cross-checks) can be shown on the matching input instead of only a toast. */
export function mapServerFieldErrors(error: unknown): Record<string, string> {
    const data = getResponseData(error);
    if (!data || typeof data !== "object") return {};

    const errors = (data as { errors?: unknown }).errors;
    if (!Array.isArray(errors)) return {};

    const map: Record<string, string> = {};
    for (const item of errors) {
        const detail = item as ApiErrorDetail;
        if (detail.field && detail.message && !map[detail.field]) {
            map[detail.field] = detail.message;
        }
    }
    return map;
}

export function getApiSuccessMessage(response: unknown, fallback: string) {
    const data = getResponseData(response);
    const message = getMessageFromData(data);
    if (!message || message.toLowerCase() === "success") return fallback;
    return message;
}

