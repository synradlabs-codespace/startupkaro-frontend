import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";
import type { RazorpayHandlerResponse } from "@/lib/razorpay";
import { flattenBackendServices, type BackendService, type BackendServiceCategory } from "@/features/services/api/services.backend";

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

export type CustomerService = BackendService;

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

export interface CustomerAddress {
    id: string;
    customerId: string;
    label: string;
    legalName: string;
    line1: string;
    line2?: string | null;
    city: string;
    stateCode: string;
    stateName?: string;
    postalCode: string;
    country: string;
    gstin?: string | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GstState {
    code: string;
    name: string;
    isUnionTerritory: boolean;
}

export type CustomerAddressPayload = {
    label: string;
    legalName: string;
    line1: string;
    line2?: string | null;
    city: string;
    stateCode: string;
    postalCode: string;
    gstin?: string | null;
    isDefault?: boolean;
};

export interface CustomerInvoiceListItem {
    id: string;
    invoiceNumber: string;
    kind: string;
    orderId: string;
    orderNumber?: string;
    placeOfSupply: string;
    supplyType: "intra_state" | "inter_state" | string;
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalTax: number;
    total: number;
    issuedAt: string;
}

export interface CustomerInvoiceDetail extends CustomerInvoiceListItem {
    financialYear: string;
    sequence: number;
    customerId: string;
    placeOfSupplyLabel: string;
    rateBps: number;
    seller: InvoiceParty;
    buyer: InvoiceParty;
    lines: InvoiceLine[];
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceParty {
    name: string;
    gstin?: string | null;
    line1: string;
    line2?: string | null;
    city: string;
    stateCode: string;
    stateName: string;
    postalCode: string;
    country: string;
    email?: string;
    phone?: string;
}

export interface InvoiceLine {
    description: string;
    sacCode?: string;
    quantity: number;
    unitPrice: number;
    taxableValue: number;
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
type ServiceCatalogEnvelope = ApiResponse<CustomerService[]> | PaginatedResponse<CustomerService> | ApiResponse<BackendServiceCategory[]>;

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

export function normalizeServiceCatalog(response: ServiceCatalogEnvelope, page = 1, limit = 20): NormalizedList<CustomerService> {
    if ("pagination" in response) {
        return { data: flattenBackendServices(response.data), pagination: response.pagination };
    }

    const data = flattenBackendServices(response.data);
    return {
        data,
        pagination: {
            total: data.length,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(data.length / limit)),
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
        apiClient.get<ServiceCatalogEnvelope>("/customer/services", { params }),
    getBySlug: (slug: string) =>
        apiClient.get<ApiResponse<CustomerService>>(`/customer/services/${slug}`),
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

export const customerAddressService = {
    states: () =>
        apiClient.get<ApiResponse<GstState[]>>("/customer/addresses/states"),
    list: () =>
        apiClient.get<ApiResponse<CustomerAddress[]>>("/customer/addresses"),
    get: (id: string) =>
        apiClient.get<ApiResponse<CustomerAddress>>(`/customer/addresses/${id}`),
    create: (payload: CustomerAddressPayload) =>
        apiClient.post<ApiResponse<CustomerAddress>>("/customer/addresses", payload),
    update: (id: string, payload: Partial<CustomerAddressPayload>) =>
        apiClient.patch<ApiResponse<CustomerAddress>>(`/customer/addresses/${id}`, payload),
    setDefault: (id: string) =>
        apiClient.post<ApiResponse<CustomerAddress>>(`/customer/addresses/${id}/default`),
    remove: (id: string) =>
        apiClient.delete<ApiResponse<null>>(`/customer/addresses/${id}`),
};

export const customerInvoiceService = {
    list: () =>
        apiClient.get<ApiResponse<CustomerInvoiceListItem[]>>("/customer/invoices"),
    get: (invoiceId: string) =>
        apiClient.get<ApiResponse<CustomerInvoiceDetail>>(`/customer/invoices/${invoiceId}`),
    download: (invoiceId: string) =>
        apiClient.get<Blob>(`/customer/invoices/${invoiceId}/download`, { responseType: "blob" }),
    downloadByOrder: (orderId: string) =>
        apiClient.get<Blob>(`/customer/invoices/order/${orderId}/download`, { responseType: "blob" }),
};

export const publicInquiryService = {
    submit: (payload: { name: string; email: string; phone: string; subject: string; message: string }) =>
        apiClient.post<ApiResponse<{ id: string; name: string; email: string; phone: string; subject: string; message: string; createdAt: string }>>("/customer/inquiry", payload),
};
