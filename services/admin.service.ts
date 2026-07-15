import { apiClient } from "./api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api.types";

export type AdminRole = "admin" | "employee";
export type OrderStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type PaymentStatus = "created" | "authorized" | "captured" | "failed" | "refunded";
export type InquiryStatus = "unresolved" | "resolved";

export interface Note {
    text: string;
    createdAt: string;
    createdBy: { id: string; name: string };
}

export interface AdminEmployee {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: AdminRole;
    isActive: boolean;
    createdAt: string;
}

export interface AdminCustomer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
}

export interface AdminService {
    id: string;
    name: string;
    slug: string;
    description?: string;
    category: "start" | "manage" | "protect" | string;
    type: "fixed" | "quote" | string;
    price: number | null;
    isActive: boolean;
    sortOrder?: number;
    createdAt: string;
}

export interface AdminBundleItem {
    id?: string;
    label: string;
    componentServiceId?: string | null;
    componentService?: { id: string; name: string; slug?: string } | null;
}

export interface AdminBundle {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    category?: "bundles" | string;
    type?: "bundle" | string;
    price: number;
    isActive: boolean;
    sortOrder?: number;
    items: AdminBundleItem[];
    createdAt: string;
}

export interface AdminOrder {
    id: string;
    orderNumber: string;
    customer: { id: string; name: string; email: string; phone?: string };
    service: { id: string; name: string };
    amount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes: Note[];
    createdAt: string;
}

export interface AdminPayment {
    id: string;
    orderId?: string;
    orderNumber?: string;
    order?: { id: string; orderNumber?: string };
    customerId?: string;
    customerName?: string;
    customerEmail?: string;
    customer?: { id: string; name: string; email: string };
    amount: number;
    currency?: string;
    status: PaymentStatus;
    method?: string;
    razorpayPaymentId?: string;
    paidAt?: string | null;
    createdAt: string;
}

export type OrderPaymentState = "unpaid" | "partially_paid" | "paid";

export interface AdminOrderPayment {
    id: string;
    amount: number;
    status?: PaymentStatus | string;
    method?: string | null;
    reference?: string | null;
    razorpayPaymentId?: string | null;
    paidAt?: string | null;
    createdAt?: string;
}

export interface AdminOrderPaymentsSummary {
    orderId?: string;
    orderNumber?: string;
    amount: number;
    amountPaid: number;
    amountDue: number;
    paymentState: OrderPaymentState | string;
    payments: AdminOrderPayment[];
}

export interface AdminRevenuePoint {
    period?: string;
    date?: string;
    month?: string;
    revenue?: number;
    amount?: number;
    total?: number;
    count?: number;
}

export interface AdminRevenueAnalytics {
    from?: string;
    to?: string;
    total?: number;
    totalRevenue?: number;
    revenue?: number;
    series?: AdminRevenuePoint[];
    data?: AdminRevenuePoint[];
    points?: AdminRevenuePoint[];
}

export interface AdminOrdersAnalytics {
    from: string;
    to: string;
    totalOrders: number;
    totalValue: number;
    collected: number;
    outstanding: number;
    byStatus: { status: string; count: number; value: number }[];
}

export interface AdminServiceAnalyticsRow {
    id?: string;
    serviceId?: string;
    name?: string;
    serviceName?: string;
    category?: string;
    type?: string;
    orders?: number;
    orderCount?: number;
    count?: number;
    revenue?: number;
    amount?: number;
}

export interface AdminPaymentHealthAnalytics {
    from: string;
    to: string;
    paymentsByStatus: { status: string; count: number; amount?: number }[];
    paymentsByChannel: { channel: string; count: number; amount: number }[];
    linksByStatus: { status: string; count: number; amount?: number }[];
    successRate: number | null;
}

export interface AdminInquiry {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: InquiryStatus;
    notes?: Note[];
    createdAt: string;
}

export const adminEmployeeService = {
    list: (params?: { search?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminEmployee>>("/admin/employees", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminEmployee>>(`/admin/employees/${id}`),
    create: (payload: { name: string; email: string; password: string; phone?: string; role: AdminRole }) =>
        apiClient.post<ApiResponse<AdminEmployee>>("/admin/employees", payload),
    update: (id: string, payload: Partial<{ name: string; isActive: boolean; role: AdminRole }>) =>
        apiClient.patch<ApiResponse<AdminEmployee>>(`/admin/employees/${id}`, payload),
};

export const adminCustomerService = {
    list: (params?: { search?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminCustomer>>("/admin/customers", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminCustomer>>(`/admin/customers/${id}`),
};

export const adminServiceService = {
    list: (params?: { page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminService>>("/admin/services", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminService>>(`/admin/services/${id}`),
    create: (payload: {
        name: string;
        slug: string;
        description?: string;
        category: "start" | "manage" | "protect";
        type?: "fixed" | "quote";
        price?: number | null;
        sortOrder?: number;
    }) =>
        apiClient.post<ApiResponse<AdminService>>("/admin/services", payload),
    update: (id: string, payload: Partial<{ name: string; slug: string; description: string | null; category: "start" | "manage" | "protect"; type: "fixed" | "quote"; price: number | null; isActive: boolean; sortOrder: number }>) =>
        apiClient.patch<ApiResponse<AdminService>>(`/admin/services/${id}`, payload),
    remove: (id: string) =>
        apiClient.delete<ApiResponse<null>>(`/admin/services/${id}`),
};

export const adminBundleService = {
    list: () =>
        apiClient.get<ApiResponse<AdminBundle[]> | PaginatedResponse<AdminBundle>>("/admin/bundles"),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminBundle>>(`/admin/bundles/${id}`),
    create: (payload: {
        name: string;
        slug: string;
        description?: string;
        price: number;
        sortOrder?: number;
        items?: { label: string; componentServiceId?: string | null }[];
    }) =>
        apiClient.post<ApiResponse<AdminBundle>>("/admin/bundles", payload),
    update: (id: string, payload: Partial<{
        name: string;
        slug: string;
        description: string | null;
        price: number;
        sortOrder: number;
        isActive: boolean;
        items: { label: string; componentServiceId?: string | null }[];
    }>) =>
        apiClient.patch<ApiResponse<AdminBundle>>(`/admin/bundles/${id}`, payload),
    remove: (id: string) =>
        apiClient.delete<ApiResponse<null>>(`/admin/bundles/${id}`),
};

export const adminOrderService = {
    list: (params?: { search?: string; status?: string; customerId?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminOrder>>("/admin/orders", { params }),
    listByCustomer: (customerId: string) =>
        apiClient.get<PaginatedResponse<AdminOrder>>("/admin/orders", { params: { customerId } }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminOrder>>(`/admin/orders/${id}`),
    create: (payload: { customerId: string; serviceId: string; amount: number; status?: string; notes?: string; inquiryId?: string }) =>
        apiClient.post<ApiResponse<AdminOrder>>("/admin/orders", payload),
    update: (id: string, payload: Partial<{ status: string; amount: number; notes: { text: string }[] }>) =>
        apiClient.patch<ApiResponse<AdminOrder>>(`/admin/orders/${id}`, payload),
    listPayments: (id: string) =>
        apiClient.get<ApiResponse<AdminOrderPaymentsSummary | AdminOrderPayment[]>>(`/admin/orders/${id}/payments`),
    recordOfflinePayment: (id: string, payload: { amount: number; reference?: string; paidAt?: string }) =>
        apiClient.post<ApiResponse<AdminOrderPayment>>(`/admin/orders/${id}/payments`, payload),
};

export const adminPaymentService = {
    list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminPayment>>("/admin/payments", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminPayment>>(`/admin/payments/${id}`),
};

export const adminAnalyticsService = {
    revenue: (params?: { from?: string; to?: string; granularity?: "day" | "month" }) =>
        apiClient.get<ApiResponse<AdminRevenueAnalytics>>("/admin/analytics/revenue", { params }),
    orders: (params?: { from?: string; to?: string }) =>
        apiClient.get<ApiResponse<AdminOrdersAnalytics>>("/admin/analytics/orders", { params }),
    byService: (params?: { from?: string; to?: string }) =>
        apiClient.get<ApiResponse<AdminServiceAnalyticsRow[]>>("/admin/analytics/by-service", { params }),
    paymentHealth: (params?: { from?: string; to?: string }) =>
        apiClient.get<ApiResponse<AdminPaymentHealthAnalytics>>("/admin/analytics/payment-health", { params }),
};

export const adminInquiryService = {
    list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminInquiry>>("/admin/inquiries", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminInquiry>>(`/admin/inquiries/${id}`),
    update: (id: string, payload: Partial<{ status: InquiryStatus; notes: { text: string }[] }>) =>
        apiClient.patch<ApiResponse<AdminInquiry>>(`/admin/inquiries/${id}`, payload),
    remove: (id: string) =>
        apiClient.delete<ApiResponse<null>>(`/admin/inquiries/${id}`),
};

export const adminInvoiceService = {
    getSummary: (orderId: string) =>
        apiClient.get<ApiResponse<{ invoiceNumber: string; issuedAt: string; items: { description: string; amount: number }[] }>>(`/admin/invoices/order/${orderId}`),
    download: (orderId: string) =>
        apiClient.get<Blob>(`/admin/invoices/order/${orderId}/download`, { responseType: "blob" }),
};
