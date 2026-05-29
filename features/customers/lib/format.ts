import type { CustomerPurchase } from "@/services/customer.service";

export function formatCustomerDate(value?: string) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

export function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function getPurchaseId(purchase: CustomerPurchase) {
    return purchase.id ?? "";
}

export function getPurchaseServiceName(purchase: CustomerPurchase) {
    return purchase.service.name;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
    const apiError = error as { response?: { status?: number; data?: { message?: string } } };
    return apiError.response?.data?.message ?? fallback;
}

export function isRateLimited(error: unknown) {
    const apiError = error as { response?: { status?: number } };
    return apiError.response?.status === 429;
}
