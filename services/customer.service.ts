import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { RazorpayHandlerResponse } from "@/lib/razorpay";

export type CustomerOrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type CustomerPaymentStatus = "created" | "authorized" | "captured" | "failed" | "refunded";

export interface CustomerProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    mobile?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CustomerService {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    duration: string;
}

export interface CustomerPurchase {
    id: string;
    orderNumber?: string;
    service: { id: string; name: string; description?: string };
    amount: number;
    status: CustomerOrderStatus;
    paymentStatus: CustomerPaymentStatus;
    createdAt?: string;
    date?: string;
}

export interface PurchaseInitiation {
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;
    currency: string;
    serviceName: string;
}

export type NormalizedList<T> = {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

type ListEnvelope<T> = ApiResponse<T[]> | PaginatedResponse<T>;

export function normalizeList<T>(response: ListEnvelope<T>, page = 1, limit = 20): NormalizedList<T> {
    if ("pagination" in response) {
        return { data: response.data, pagination: response.pagination };
    }

    return {
        data: response.data,
        pagination: {
            total: response.data.length,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(response.data.length / limit)),
        },
    };
}

export const customerProfileService = {
    get: () =>
        apiClient.get<ApiResponse<CustomerProfile>>("/customer/profile"),
    update: (payload: { name: string; phone: string }) =>
        apiClient.patch<ApiResponse<CustomerProfile>>("/customer/profile", payload),
    changePassword: (payload: { currentPassword: string; newPassword: string }) =>
        apiClient.post<ApiResponse<{ message: string }>>("/customer/profile/change-password", payload),
};

export const customerServiceCatalog = {
    list: (params?: { search?: string; category?: string; page?: number; limit?: number }) =>
        apiClient.get<ListEnvelope<CustomerService>>("/customer/services", { params }),
};

export const customerPurchaseService = {
    initiate: (payload: { serviceId: string }) =>
        apiClient.post<ApiResponse<PurchaseInitiation>>("/customer/purchases/initiate", payload),
    verify: (payload: RazorpayHandlerResponse) =>
        apiClient.post<ApiResponse<{ message: string; orderId: string }>>("/customer/purchases/verify", {
            razorpayOrderId: payload.razorpay_order_id,
            razorpayPaymentId: payload.razorpay_payment_id,
            razorpaySignature: payload.razorpay_signature,
        }),
    list: (params?: { page?: number; limit?: number }) =>
        apiClient.get<ListEnvelope<CustomerPurchase>>("/customer/purchases", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<CustomerPurchase>>(`/customer/purchases/${id}`),
};

export const customerInvoiceService = {
    download: (orderId: string) =>
        apiClient.get<Blob>(`/customer/invoices/${orderId}/download`, { responseType: "blob" }),
};

export const publicInquiryService = {
    submit: (payload: { name: string; email: string; phone: string; subject: string; message: string }) =>
        apiClient.post<ApiResponse<{ id: string; name: string; email: string; phone: string; subject: string; message: string; createdAt: string }>>("/customer/inquiry", payload),
};
