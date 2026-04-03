// lib/rbax/roles.ts

export const ROLES = {
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE",
    CUSTOMER: "CUSTOMER",
} as const;

export type Role = keyof typeof ROLES;

export const ROLE_REDIRECTS: Record<Role, string> = {
    ADMIN: "/admin",
    EMPLOYEE: "/employee",
    CUSTOMER: "/customer",
};

export const ROLE_LOGIN_ROUTES: Record<Role, string> = {
    ADMIN: "/admin/login",
    EMPLOYEE: "/employee/login",
    CUSTOMER: "/customer/login",
};