import type { CustomerPurchase } from "@/services/customer.service";
export { getApiErrorMessage } from "@/lib/api-messages";

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
    if (purchase.service?.name) return purchase.service.name;
    if (purchase.items?.length === 1) return purchase.items[0].name;
    if (purchase.items?.length) return `${purchase.items.length} services`;
    return "StartupKaro service";
}

export function isRateLimited(error: unknown) {
    const apiError = error as { response?: { status?: number } };
    return apiError.response?.status === 429;
}
