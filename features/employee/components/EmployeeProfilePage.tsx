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
                <div className="relative overflow-hidden rounded-2xl border border-[#000080]/15 bg-gradient-to-br from-[#000080]/8 via-white/80 to-indigo-50/60 backdrop-blur-sm shadow-sm p-8">
                    <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#000080]/8 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-indigo-300/10 blur-2xl" />

                    <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar with camera */}
                        <div className="relative shrink-0">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#000080]/20 to-indigo-200/40 border-2 border-[#000080]/20 flex items-center justify-center shadow-inner">
                                <span className="text-2xl font-semibold text-[#000080]">
                                    {profile.initials}
                                </span>
                            </div>
                            <button
                                type="button"
                                title="Upload photo"
                                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#000080] text-white flex items-center justify-center shadow-md hover:bg-[#000080]/90 transition-colors"
                            >
                                <Camera className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#000080]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#000080]">
                                    <BadgeCheck className="h-3 w-3" />
                                    Employee
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                {profile.email}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5">
                                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                {profile.role} · {profile.department}
                            </p>
                            <p className="mt-2 text-xs text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                Member since {profile.joined}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Content Grid ────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Personal Information — all locked */}
                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                            <div className="h-7 w-7 rounded-lg bg-[#000080]/10 flex items-center justify-center">
                                <User className="h-3.5 w-3.5 text-[#000080]" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">Personal Information</h3>
                            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                                <Lock className="h-2.5 w-2.5" /> Managed by Admin
                            </span>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <User className="h-3 w-3" /> Full Name
                            </p>
                            <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3 w-3" /> Email Address
                            </p>
                            <p className="text-sm text-gray-700">{profile.email}</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="h-3 w-3" /> Phone Number
                            </p>
                            <p className="text-sm text-gray-700">{profile.phone}</p>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                <Briefcase className="h-3 w-3" /> Role &amp; Department
                            </p>
                            <p className="text-sm text-gray-700">{profile.role} · {profile.department}</p>
                        </div>

                        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 flex gap-2 items-start">
                            <Lock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Personal details are managed by the admin. Contact your admin to update any information.
                            </p>
                        </div>
                    </div>

                    {/* Account & Security */}
                    <div className="rounded-2xl border border-gray-200/60 bg-white/70 backdrop-blur-sm shadow-sm p-6 space-y-5">
                        <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800">Account &amp; Security</h3>
                        </div>

                        {/* Joined */}
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                            <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Member Since</p>
                                <p className="text-sm text-gray-800 font-medium">{profile.joined}</p>
                            </div>
                        </div>

                        {/* Photo upload */}
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                <Camera className="h-4 w-4 text-[#000080]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">Profile Photo</p>
                                <p className="text-xs text-gray-400">Upload or update your profile picture</p>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
                            >
                                Upload
                            </button>
                        </div>

                        {/* Password */}
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
                            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                <KeyRound className="h-4 w-4 text-[#000080]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">Password</p>
                                <p className="text-xs text-gray-400">Keep your account secure with a strong password</p>
                            </div>
                            <Link
                                href="/employee/profile/change-password"
                                className="inline-flex items-center h-7 px-2.5 text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl transition-colors shrink-0"
                            >
                                Change
                            </Link>
                        </div>

                        {/* Security tip */}
                        <div className="rounded-xl bg-[#000080]/5 border border-[#000080]/10 p-3 flex gap-2.5">
                            <ShieldCheck className="h-4 w-4 text-[#000080] shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Use a strong, unique password and never share it. We will never ask for your password via email or phone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
