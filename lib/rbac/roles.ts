// lib/rbac/roles.ts

export const ROLES = {
    ADMIN: "admin",
    EMPLOYEE: "employee",
    CUSTOMER: "customer",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_REDIRECTS: Record<Role, string> = {
    admin: "/admin",
    employee: "/employee",
    customer: "/customer",
};

export const ROLE_LOGIN_ROUTES: Record<Role, string> = {
    admin: "/admin/login",
    employee: "/employee/login",
    customer: "/customer/login",
};
