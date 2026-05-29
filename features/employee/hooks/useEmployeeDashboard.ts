"use client";

import { useOrderList } from "@/features/admin/hooks/useAdminOrders";
import { useCustomerList } from "@/features/admin/hooks/useAdminCustomers";
import { useInquiryList } from "@/features/admin/hooks/useAdminInquiries";
import { usePaymentList } from "@/features/admin/hooks/useAdminPayments";

export function useEmployeeDashboard() {
    const ordersQuery = useOrderList({ limit: 5 });
    const customersQuery = useCustomerList({ limit: 5 });
    const inquiriesQuery = useInquiryList({ limit: 5 });
    const paymentsQuery = usePaymentList({ limit: 5 });

    const isLoading =
        ordersQuery.isLoading ||
        customersQuery.isLoading ||
        inquiriesQuery.isLoading ||
        paymentsQuery.isLoading;

    return {
        isLoading,
        counts: {
            orders: ordersQuery.data?.pagination.total ?? 0,
            customers: customersQuery.data?.pagination.total ?? 0,
            inquiries: inquiriesQuery.data?.pagination.total ?? 0,
            payments: paymentsQuery.data?.pagination.total ?? 0,
        },
        recentOrders: ordersQuery.data?.data ?? [],
        recentInquiries: inquiriesQuery.data?.data ?? [],
    };
}
