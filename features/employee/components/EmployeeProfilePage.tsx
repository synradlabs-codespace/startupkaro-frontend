"use client";

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import { useEmployeeMe } from "@/features/auth/employee/hooks/useEmployeeAuth";
import { getInitials } from "@/features/admin/lib/format";
import { formatRole } from "@/components/custom/StatusBadge";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    KeyRound,
    BadgeCheck,
} from "lucide-react";

export function EmployeeProfilePage() {
    const me = useEmployeeMe();

    const initials = me.name ? getInitials(me.name) : "EM";
    const displayRole = me.role ? formatRole(me.role) : "Employee";

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="My Profile"
                description="View your profile information and manage account security"
            />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Card ───────────────────────────── */}
                <div className="rounded-xl bg-primary-brand px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full ring-2 ring-white/60 ring-offset-2 ring-offset-primary-brand bg-white flex items-center justify-center shrink-0">
                            <span className="text-lg font-semibold text-primary-deep">{initials}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                {me.isLoading ? "Loading..." : me.name || "Employee"}
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white mt-1">
                                <BadgeCheck className="h-3 w-3" />
                                {displayRole}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Content Grid ────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal Information — locked (no edit endpoint) */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Personal Information</h3>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </p>
                            <p className="text-sm font-medium text-ink">{me.name || "—"}</p>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Email Address
                            </p>
                            <p className="text-sm text-slate">{me.email || "—"}</p>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone Number
                            </p>
                            <p className="text-sm text-slate">{me.phone || "—"}</p>
                        </div>

                    </div>

                    {/* Account & Security */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-primary-brand/10 flex items-center justify-center">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary-brand" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Account &amp; Security</h3>
                        </div>

                        {/* Password — kept in UI, API endpoint pending */}
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-hairline bg-surface">
                            <div className="h-9 w-9 rounded-lg bg-primary-brand/10 flex items-center justify-center shrink-0">
                                <KeyRound className="h-4 w-4 text-primary-brand" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal">Password</p>
                                {/* TODO: wire to POST /admin/profile/change-password once backend adds endpoint — see API_MISMATCHES.md */}
                                <p className="text-xs text-stone">Keep your account secure with a strong password</p>
                            </div>
                            <Link
                                href="/employee/profile/change-password"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-lg transition-colors shrink-0"
                            >
                                Change
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
