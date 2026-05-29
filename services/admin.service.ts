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
    price: number;
    isActive: boolean;
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
    orderId: string;
    orderNumber?: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    status: PaymentStatus;
    method?: string;
    razorpayPaymentId?: string;
    paidAt?: string | null;
    createdAt: string;
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
    create: (payload: { name: string; slug?: string; description?: string; price: number; isActive?: boolean }) =>
        apiClient.post<ApiResponse<AdminService>>("/admin/services", payload),
    update: (id: string, payload: Partial<{ name: string; slug: string; description: string; price: number; isActive: boolean }>) =>
        apiClient.patch<ApiResponse<AdminService>>(`/admin/services/${id}`, payload),
    remove: (id: string) =>
        apiClient.delete<ApiResponse<null>>(`/admin/services/${id}`),
};

export const adminOrderService = {
    list: (params?: { search?: string; status?: string; customerId?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminOrder>>("/admin/orders", { params }),
    listByCustomer: (customerId: string) =>
        apiClient.get<PaginatedResponse<AdminOrder>>("/admin/orders", { params: { customerId } }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminOrder>>(`/admin/orders/${id}`),
    create: (payload: { customerId: string; serviceId: string; amount: number; status?: string; notes?: string }) =>
        apiClient.post<ApiResponse<AdminOrder>>("/admin/orders", payload),
    update: (id: string, payload: Partial<{ status: string; amount: number; notes: { text: string }[] }>) =>
        apiClient.patch<ApiResponse<AdminOrder>>(`/admin/orders/${id}`, payload),
};

export const adminPaymentService = {
    list: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
        apiClient.get<PaginatedResponse<AdminPayment>>("/admin/payments", { params }),
    get: (id: string) =>
        apiClient.get<ApiResponse<AdminPayment>>(`/admin/payments/${id}`),
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
