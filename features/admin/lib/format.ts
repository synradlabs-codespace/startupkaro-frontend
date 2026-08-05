export { getApiErrorMessage } from "@/lib/api-messages";
import type { AdminOrder } from "@/services/admin.service";

export function formatDate(value?: string) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

export function formatTime(value?: string) {
    if (!value) return "";
    return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value));
}

export function formatDateHeader(value: string) {
    const date = new Date(value);
    const day = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
    const weekday = new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(date);
    return `${day}, ${weekday}`;
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

export function getAdminOrderServiceName(order: Pick<AdminOrder, "service" | "items">) {
    if (order.service?.name) return order.service.name;
    if (order.items?.length === 1) return order.items[0].name;
    if (order.items?.length) return `${order.items.length} services`;
    return "StartupKaro service";
}

export function getAdminOrderPaymentStatus(order: Pick<AdminOrder, "paymentStatus" | "paymentState">) {
    return order.paymentStatus ?? order.paymentState ?? "unpaid";
}
