"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { validators } from "@/lib/validations/common.schema";
import { submitJobApplication } from "@/features/careers/api/applications.service";
import type {
    ApplicationFormState,
    ApplicationFormErrors,
    ApplicationPayload,
    CurrentCTC,
    ExpectedCTC,
    NoticePeriod,
} from "@/features/careers/types/application.types";
import type { Job } from "@/features/careers/types";

const CURRENT_CTC_OPTIONS: { label: string; value: CurrentCTC }[] = [
    { label: "0 (Fresher)", value: "0" },
    { label: "2 – 5 LPA", value: "2-5 LPA" },
    { label: "5 – 8 LPA", value: "5-8 LPA" },
    { label: "8 – 11 LPA", value: "8-11 LPA" },
    { label: "Above 11 LPA", value: "Above 11 LPA" },
];

const EXPECTED_CTC_OPTIONS: { label: string; value: ExpectedCTC }[] = [
    { label: "2 – 5 LPA", value: "2-5 LPA" },
    { label: "5 – 8 LPA", value: "5-8 LPA" },
    { label: "8 – 11 LPA", value: "8-11 LPA" },
    { label: "Above 11 LPA", value: "Above 11 LPA" },
];

const NOTICE_PERIOD_OPTIONS: { label: string; value: NoticePeriod }[] = [
    { label: "Join immediately", value: "Join immediately" },
    { label: "Less than 30 days", value: "<30 days" },
    { label: "31 to 60 days", value: "31 to 60 days" },
    { label: "More than 60 days", value: ">60 days" },
];

const YEARS = Array.from({ length: 41 }, (_, i) => String(i));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i));

const INPUT_BASE =
    "w-full bg-gray-50 border rounded-xl px-4 py-3 text-black text-sm placeholder-gray-400 focus:outline-none transition-colors font-sans";
const INPUT_DEFAULT = "border-gray-200 focus:border-gray-400";
const INPUT_ERROR = "border-red-300 focus:border-red-400";

const LABEL_CLASS = "block text-xs text-gray-500 mb-2 font-mono tracking-widest uppercase";

function validateLinkedin(v: string): string | null {
    if (!v.trim()) return "LinkedIn URL is required";
    if (!/^https?:\/\/(www\.)?linkedin\.com\/in\//.test(v.trim()))
        return "Enter a valid LinkedIn profile URL (linkedin.com/in/…)";
    return null;
}

function validateIndianPhone(v: string): string | null {
    if (!v.trim()) return "Mobile number is required";
    const stripped = v.trim().replace(/[\s\-()​]/g, "");
    if (!/^(\+91)?[6-9]\d{9}$/.test(stripped))
        return "Enter a valid Indian mobile number (e.g. +91 98765 43210)";
    return null;
}

const EMPTY_FORM: ApplicationFormState = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    experienceYears: "0",
    experienceMonths: "0",
    currentCtc: "",
    expectedCtc: "",
    noticePeriod: "",
    linkedinUrl: "",
    summary: "",
    hasCriminalCase: "",
    agreeToTerms: false,
};

interface JobApplicationFormProps {
    job: Job;
}

export function JobApplicationForm({ job }: JobApplicationFormProps) {
    const [form, setForm] = useState<ApplicationFormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<ApplicationFormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const set = <K extends keyof ApplicationFormState>(field: K, value: ApplicationFormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    function validate(): ApplicationFormErrors {
        return {
            firstName: validators.name(form.firstName) ?? undefined,
            lastName: validators.name(form.lastName) ?? undefined,
            email: validators.email(form.email) ?? undefined,
            mobile: validateIndianPhone(form.mobile) ?? undefined,
            experienceYears: !form.experienceYears ? "Select years of experience" : undefined,
            currentCtc: !form.currentCtc ? "Please select your current CTC" : undefined,
            expectedCtc: !form.expectedCtc ? "Please select your expected CTC" : undefined,
            noticePeriod: !form.noticePeriod ? "Please select a notice period" : undefined,
            linkedinUrl: validateLinkedin(form.linkedinUrl) ?? undefined,
            hasCriminalCase: !form.hasCriminalCase ? "Please select an answer" : undefined,
            agreeToTerms: !form.agreeToTerms
                ? "You must confirm the accuracy of information provided"
                : undefined,
        };
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.values(errs).some(Boolean)) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        const payload: ApplicationPayload = {
            jobId: job.jobId,
            jobTitle: job.title,
            submittedAt: new Date().toISOString(),
            firstName: form.firstName.trim(),
            middleName: form.middleName.trim() || undefined,
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            mobile: form.mobile.trim(),
            experienceYears: Number(form.experienceYears),
            experienceMonths: Number(form.experienceMonths),
            currentCtc: form.currentCtc,
            expectedCtc: form.expectedCtc,
            noticePeriod: form.noticePeriod,
            linkedinUrl: form.linkedinUrl.trim(),
            summary: form.summary.trim() || undefined,
            hasCriminalCase: form.hasCriminalCase === "Yes",
        };

        try {
            await submitJobApplication(payload);
            setSubmitted(true);
        } catch {
            setErrors((prev) => ({
                ...prev,
                submit: "Something went wrong. Please try again or contact us directly.",
            }));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center" id="apply">
                <div className="h-16 w-16 rounded-full bg-[#FF9933]/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#FF9933]" />
                </div>
                <h3 className="font-serif text-2xl text-gray-900 font-normal mb-2">
                    Application submitted!
                </h3>
                <p className="text-sm text-gray-500 max-w-md">
                    Thank you for your interest in joining StartupKaro. We review every application carefully and will be in touch soon.
                </p>
            </div>
        );
    }

    return (
        <div id="apply" className="scroll-mt-20">
            <div className="border border-gray-200 rounded-2xl p-6 md:p-10 bg-white shadow-sm">
                <h2 className="font-serif text-2xl text-gray-900 font-normal mb-1">Apply for this role</h2>
                <p className="text-sm text-gray-500 mb-8">All fields are required unless marked optional.</p>

                <form onSubmit={handleSubmit} noValidate className="space-y-7">

                    {/* Auto-filled fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <label className={LABEL_CLASS}>Job ID</label>
                            <input
                                readOnly
                                value={job.jobId}
                                className={`${INPUT_BASE} ${INPUT_DEFAULT} bg-gray-100 text-gray-500 cursor-default select-none`}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={LABEL_CLASS}>Position</label>
                            <input
                                readOnly
                                value={job.title}
                                className={`${INPUT_BASE} ${INPUT_DEFAULT} bg-gray-100 text-gray-500 cursor-default select-none`}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <label className={LABEL_CLASS}>First Name</label>
                            <input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => set("firstName", e.target.value)}
                                placeholder="Rahul"
                                autoComplete="given-name"
                                className={`${INPUT_BASE} ${errors.firstName ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.firstName && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>
                                Middle Name <span className="normal-case text-gray-400">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={form.middleName}
                                onChange={(e) => set("middleName", e.target.value)}
                                placeholder="Kumar"
                                autoComplete="additional-name"
                                className={`${INPUT_BASE} ${INPUT_DEFAULT}`}
                            />
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Last Name</label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => set("lastName", e.target.value)}
                                placeholder="Sharma"
                                autoComplete="family-name"
                                className={`${INPUT_BASE} ${errors.lastName ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.lastName && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className={LABEL_CLASS}>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                placeholder="rahul@example.com"
                                autoComplete="email"
                                className={`${INPUT_BASE} ${errors.email ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className={LABEL_CLASS}>Mobile Number</label>
                            <input
                                type="tel"
                                value={form.mobile}
                                onChange={(e) => set("mobile", e.target.value.replace(/[^\d+]/g, ""))}
                                placeholder="+91 9876543210"
                                autoComplete="tel"
                                inputMode="numeric"
                                className={`${INPUT_BASE} ${errors.mobile ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.mobile && (
                                <p className="mt-1.5 text-xs text-red-500">{errors.mobile}</p>
                            )}
                        </div>
                    </div>

                    {/* Experience */}
                    <div>
                        <label className={LABEL_CLASS}>Years of Experience</label>
                        <div className="flex gap-3">
                            <div className="w-40">
                                <Select
                                    value={form.experienceYears}
                                    onValueChange={(v) => set("experienceYears", v ?? "0")}
                                >
                                    <SelectTrigger className={`h-11 rounded-xl bg-gray-50 text-sm ${errors.experienceYears ? "border-red-300" : "border-gray-200"}`}>
                                        <SelectValue placeholder="Years" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {YEARS.map((y) => (
                                            <SelectItem key={y} value={y}>
                                                {y === "0" ? "0 years" : `${y} year${y === "1" ? "" : "s"}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-40">
                                <Select
                                    value={form.experienceMonths}
                                    onValueChange={(v) => set("experienceMonths", v ?? "0")}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-gray-50 text-sm border-gray-200">
                                        <SelectValue placeholder="Months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m === "0" ? "0 months" : `${m} month${m === "1" ? "" : "s"}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {errors.experienceYears && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.experienceYears}</p>
                        )}
                    </div>

                    {/* Current CTC */}
                    <div>
                        <label className={LABEL_CLASS}>Current CTC</label>
                        <RadioGroup
                            value={form.currentCtc}
                            onValueChange={(v) => set("currentCtc", v as CurrentCTC)}
                            className="flex flex-wrap gap-x-6 gap-y-2 mt-1"
                        >
                            {CURRENT_CTC_OPTIONS.map((opt) => (
                                <div key={opt.value} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={opt.value}
                                        id={`current-ctc-${opt.value}`}
                                        className="border-gray-300 data-[state=checked]:border-[#FF9933] data-[state=checked]:text-[#FF9933]"
                                    />
                                    <Label
                                        htmlFor={`current-ctc-${opt.value}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.currentCtc && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.currentCtc}</p>
                        )}
                    </div>

                    {/* Expected CTC */}
                    <div>
                        <label className={LABEL_CLASS}>Expected CTC</label>
                        <RadioGroup
                            value={form.expectedCtc}
                            onValueChange={(v) => set("expectedCtc", v as ExpectedCTC)}
                            className="flex flex-wrap gap-x-6 gap-y-2 mt-1"
                        >
                            {EXPECTED_CTC_OPTIONS.map((opt) => (
                                <div key={opt.value} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={opt.value}
                                        id={`expected-ctc-${opt.value}`}
                                        className="border-gray-300 data-[state=checked]:border-[#FF9933] data-[state=checked]:text-[#FF9933]"
                                    />
                                    <Label
                                        htmlFor={`expected-ctc-${opt.value}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.expectedCtc && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.expectedCtc}</p>
                        )}
                    </div>

                    {/* Notice Period */}
                    <div>
                        <label className={LABEL_CLASS}>Notice Period</label>
                        <RadioGroup
                            value={form.noticePeriod}
                            onValueChange={(v) => set("noticePeriod", v as NoticePeriod)}
                            className="flex flex-wrap gap-x-6 gap-y-2 mt-1"
                        >
                            {NOTICE_PERIOD_OPTIONS.map((opt) => (
                                <div key={opt.value} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={opt.value}
                                        id={`notice-${opt.value}`}
                                        className="border-gray-300 data-[state=checked]:border-[#FF9933] data-[state=checked]:text-[#FF9933]"
                                    />
                                    <Label
                                        htmlFor={`notice-${opt.value}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.noticePeriod && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.noticePeriod}</p>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className={LABEL_CLASS}>LinkedIn Profile URL</label>
                        <input
                            type="url"
                            value={form.linkedinUrl}
                            onChange={(e) => set("linkedinUrl", e.target.value)}
                            placeholder="https://linkedin.com/in/rahulsharma"
                            className={`${INPUT_BASE} ${errors.linkedinUrl ? INPUT_ERROR : INPUT_DEFAULT}`}
                        />
                        {errors.linkedinUrl && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.linkedinUrl}</p>
                        )}
                    </div>

                    {/* Summary */}
                    <div>
                        <label className={LABEL_CLASS}>
                            Summary, Achievements &amp; Work Links{" "}
                            <span className="normal-case text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            value={form.summary}
                            onChange={(e) => set("summary", e.target.value)}
                            placeholder="Tell us about your key achievements, projects, portfolio links, or anything that sets you apart…"
                            rows={4}
                            className={`${INPUT_BASE} ${INPUT_DEFAULT} resize-none`}
                        />
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Criminal cases */}
                    <div>
                        <label className={LABEL_CLASS}>
                            Do you have any pending criminal cases or convictions that might impact your employment eligibility?
                        </label>
                        <RadioGroup
                            value={form.hasCriminalCase}
                            onValueChange={(v) => set("hasCriminalCase", v as "Yes" | "No")}
                            className="flex gap-8 mt-2"
                        >
                            {(["Yes", "No"] as const).map((val) => (
                                <div key={val} className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value={val}
                                        id={`criminal-${val}`}
                                        className="border-gray-300 data-[state=checked]:border-[#FF9933] data-[state=checked]:text-[#FF9933]"
                                    />
                                    <Label
                                        htmlFor={`criminal-${val}`}
                                        className="text-sm text-gray-700 cursor-pointer"
                                    >
                                        {val}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.hasCriminalCase && (
                            <p className="mt-1.5 text-xs text-red-500">{errors.hasCriminalCase}</p>
                        )}
                    </div>

                    {/* Agreement */}
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="agree"
                            checked={form.agreeToTerms}
                            onCheckedChange={(checked) => set("agreeToTerms", checked === true)}
                            className="mt-0.5 border-gray-300 data-[state=checked]:bg-[#FF9933] data-[state=checked]:border-[#FF9933]"
                        />
                        <div>
                            <Label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                                I agree that all information provided above is accurate, failing which my employment could be impacted.
                                <span className="text-[#FF9933] ml-0.5">*</span>
                            </Label>
                            {errors.agreeToTerms && (
                                <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit error */}
                    {errors.submit && (
                        <p className="text-sm text-red-500 text-center">{errors.submit}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#FF9933] hover:bg-[#FF9933]/90 shadow-sm shadow-[#FF9933]/20"
                    >
                        {loading ? "Submitting…" : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}
