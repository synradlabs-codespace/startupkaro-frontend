// features/employee/components/EmployeeProfilePage.tsx

"use client";

import Link from "next/link";
import { PageHeader } from "@/components/custom/PageHeader";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Camera,
    ShieldCheck,
    KeyRound,
    BadgeCheck,
    Lock,
    Briefcase,
} from "lucide-react";

const mockProfile = {
    name: "Arjun Mehta",
    email: "arjun@startupkaro.com",
    phone: "+91 98765 43210",
    role: "Senior Employee",
    department: "Operations",
    joined: "March 3, 2024",
    initials: "AM",
};

export function EmployeeProfilePage() {
    const profile = mockProfile;

    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader
                title="My Profile"
                description="View your profile information and manage account security"
            />

            <div className="flex-1 p-6 space-y-6">

                {/* ── Hero Card ───────────────────────────── */}
                <div className="rounded-lg border border-hairline bg-accent-employee p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar with camera */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 rounded-full border-2 border-hairline bg-canvas flex items-center justify-center">
                                <span className="text-2xl font-semibold text-charcoal">
                                    {profile.initials}
                                </span>
                            </div>
                            <button
                                type="button"
                                title="Upload photo"
                                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary-brand text-white flex items-center justify-center  hover:bg-primary-brand/90 transition-colors"
                            >
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                <h2 className="text-xl font-semibold text-ink">{profile.name}</h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-accent-employee px-2.5 py-0.5 text-[11px] font-medium text-charcoal">
                                    <BadgeCheck className="h-3 w-3" />
                                    Employee
                                </span>
                            </div>
                            <p className="text-sm text-steel flex items-center justify-center sm:justify-start gap-1.5">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {profile.email}
                            </p>
                            <p className="mt-1 text-sm text-steel flex items-center justify-center sm:justify-start gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                {profile.role} · {profile.department}
                            </p>
                            <p className="mt-2 text-xs text-stone flex items-center justify-center sm:justify-start gap-1.5">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                Member since {profile.joined}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Content Grid ────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal Information — all locked */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-accent-employee flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-charcoal" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Personal Information</h3>
                            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-stone bg-surface rounded-full px-2 py-0.5">
                                <Lock className="h-2.5 w-2.5" /> Managed by Admin
                            </span>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </p>
                            <p className="text-sm font-medium text-ink">{profile.name}</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Email Address
                            </p>
                            <p className="text-sm text-slate">{profile.email}</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone Number
                            </p>
                            <p className="text-sm text-slate">{profile.phone}</p>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-steel uppercase tracking-wide flex items-center gap-1.5">
                                <Briefcase className="h-3 w-3" /> Role &amp; Department
                            </p>
                            <p className="text-sm text-slate">{profile.role} · {profile.department}</p>
                        </div>

                        <div className="rounded-lg bg-surface border border-hairline p-3 flex gap-2 items-start">
                            <Lock className="h-3.5 w-3.5 text-stone shrink-0 mt-0.5" />
                            <p className="text-xs text-steel leading-relaxed">
                                Personal details are managed by the admin. Contact your admin to update any information.
                            </p>
                        </div>
                    </div>

                    {/* Account & Security */}
                    <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-hairline">
                            <div className="h-7 w-7 rounded-lg bg-accent-employee flex items-center justify-center">
                                <ShieldCheck className="h-3.5 w-3.5 text-charcoal" />
                            </div>
                            <h3 className="text-sm font-semibold text-charcoal">Account &amp; Security</h3>
                        </div>

                        {/* Joined */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface">
                            <Calendar className="h-4 w-4 text-stone mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-steel font-medium">Member Since</p>
                                <p className="text-sm text-charcoal font-medium">{profile.joined}</p>
                            </div>
                        </div>

                        {/* Photo upload */}
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-hairline bg-surface">
                            <div className="h-9 w-9 rounded-lg bg-accent-employee flex items-center justify-center shrink-0">
                                <Camera className="h-4 w-4 text-charcoal" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal">Profile Photo</p>
                                <p className="text-xs text-stone">Upload or update your profile picture</p>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-lg transition-colors shrink-0"
                            >
                                Upload
                            </button>
                        </div>

                        {/* Password */}
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-hairline bg-surface">
                            <div className="h-9 w-9 rounded-lg bg-accent-employee flex items-center justify-center shrink-0">
                                <KeyRound className="h-4 w-4 text-charcoal" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal">Password</p>
                                <p className="text-xs text-stone">Keep your account secure with a strong password</p>
                            </div>
                            <Link
                                href="/employee/profile/change-password"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-hairline bg-canvas text-slate hover:bg-surface rounded-lg transition-colors shrink-0"
                            >
                                Change
                            </Link>
                        </div>

                        {/* Security tip */}
                        <div className="rounded-lg bg-accent-employee border border-hairline p-3 flex gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-charcoal shrink-0 mt-0.5" />
                            <p className="text-xs text-slate leading-relaxed">
                                Use a strong, unique password and never share it. We will never ask for your password via email or phone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
