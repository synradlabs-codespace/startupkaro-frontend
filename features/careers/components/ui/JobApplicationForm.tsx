"use client";

import { useState, useRef, FormEvent, DragEvent } from "react";
import { CheckCircle2, FileText, Paperclip, UploadCloud, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneField } from "@/components/custom/PhoneField";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { validators, formatNameInput, validatePhoneDigits, buildPhone } from "@/lib/validations/common.schema";
import { submitJobApplication } from "@/features/careers/api/applications.service";
import { getApiErrorMessage, getApiSuccessMessage, mapServerFieldErrors } from "@/lib/api-messages";
import { useToast } from "@/components/providers/ToastProvider";
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
    { label: "2 to 5 LPA", value: "2-5 LPA" },
    { label: "5 to 8 LPA", value: "5-8 LPA" },
    { label: "8 to 11 LPA", value: "8-11 LPA" },
    { label: "Above 11 LPA", value: "Above 11 LPA" },
];

const EXPECTED_CTC_OPTIONS: { label: string; value: ExpectedCTC }[] = [
    { label: "2 to 5 LPA", value: "2-5 LPA" },
    { label: "5 to 8 LPA", value: "5-8 LPA" },
    { label: "8 to 11 LPA", value: "8-11 LPA" },
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

const INPUT_BASE = "h-auto w-full rounded-xl bg-surface px-4 py-3 text-sm";
const INPUT_DEFAULT = "border-hairline";
const INPUT_ERROR = "border-error-brand";

const LABEL_CLASS = "block text-xs text-graphite mb-2 font-mono tracking-widest uppercase";

function validateLinkedin(v: string): string | null {
    if (!v.trim()) return "LinkedIn URL is required";
    if (!/^https?:\/\/(www\.)?linkedin\.com\/in\//.test(v.trim()))
        return "Enter a valid LinkedIn profile URL (linkedin.com/in/…)";
    return null;
}

const ACCEPTED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ACCEPTED_EXT = [".pdf", ".docx"];
// Kept in sync with app/api/careers/apply/route.ts — Netlify Functions cap
// request bodies around ~6MB, so 4MB leaves headroom for our own friendly
// error to fire before the platform rejects the upload outright.
const MAX_RESUME_BYTES = 4 * 1024 * 1024;

function isValidResume(file: File) {
    return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXT.some((ext) => file.name.toLowerCase().endsWith(ext));
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
    resume: null,
    hasCriminalCase: "",
    agreeToTerms: false,
};

interface JobApplicationFormProps {
    job: Job;
}

export function JobApplicationForm({ job }: JobApplicationFormProps) {
    const toast = useToast();
    const [form, setForm] = useState<ApplicationFormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<ApplicationFormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const resumeInputRef = useRef<HTMLInputElement>(null);
    const honeypotRef = useRef<HTMLInputElement>(null);

    const handleResumeFile = (file: File) => {
        if (!isValidResume(file)) {
            const message = "Only PDF or DOCX files are accepted";
            setErrors((prev) => ({ ...prev, resume: message }));
            toast.error(message);
            return;
        }
        if (file.size > MAX_RESUME_BYTES) {
            const message = `Resume must be under 4 MB (yours is ${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
            setErrors((prev) => ({ ...prev, resume: message }));
            toast.error(message);
            return;
        }
        set("resume", file);
        setErrors((prev) => ({ ...prev, resume: undefined }));
    };

    const handleResumeDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleResumeFile(file);
    };

    const set = <K extends keyof ApplicationFormState>(field: K, value: ApplicationFormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        // Unconditional: previously `if (field in errors)` only cleared when the
        // key already existed on the errors object, so an error set after this
        // field was last touched could survive a fix until the next submit.
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    function validate(): ApplicationFormErrors {
        return {
            firstName: validators.name(form.firstName) ?? undefined,
            lastName: validators.name(form.lastName) ?? undefined,
            email: validators.email(form.email) ?? undefined,
            mobile: validatePhoneDigits(form.mobile, true) || undefined,
            experienceYears: !form.experienceYears ? "Select years of experience" : undefined,
            currentCtc: !form.currentCtc ? "Please select your current CTC" : undefined,
            expectedCtc: !form.expectedCtc ? "Please select your expected CTC" : undefined,
            noticePeriod: !form.noticePeriod ? "Please select a notice period" : undefined,
            linkedinUrl: validateLinkedin(form.linkedinUrl) ?? undefined,
            resume: !form.resume ? "Please upload your resume" : undefined,
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
            toast.error("Please fix the highlighted fields before submitting");
            return;
        }

        setLoading(true);
        const payload: ApplicationPayload & { honeypot?: string } = {
            jobId: job.jobId,
            jobTitle: job.title,
            submittedAt: new Date().toISOString(),
            firstName: form.firstName.trim(),
            middleName: form.middleName.trim() || undefined,
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            mobile: buildPhone(form.mobile)!,
            experienceYears: Number(form.experienceYears),
            experienceMonths: Number(form.experienceMonths),
            currentCtc: form.currentCtc,
            expectedCtc: form.expectedCtc,
            noticePeriod: form.noticePeriod,
            linkedinUrl: form.linkedinUrl.trim(),
            summary: form.summary.trim() || undefined,
            resume: form.resume!,
            hasCriminalCase: form.hasCriminalCase === "Yes",
            honeypot: honeypotRef.current?.value,
        };

        try {
            const response = await submitJobApplication(payload);
            toast.success(getApiSuccessMessage(response, "Application submitted"));
            setSubmitted(true);
        } catch (error: unknown) {
            const message = getApiErrorMessage(error, "Something went wrong. Please try again or contact us directly.");
            toast.error(message);
            const fieldErrors = mapServerFieldErrors(error);
            setErrors((prev) => ({
                ...prev,
                ...fieldErrors,
                submit: message,
            }));
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center" id="apply">
                <div className="h-16 w-16 rounded-full bg-[#296ef9]/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#296ef9]" />
                </div>
                <h3 className="font-serif text-2xl text-ink font-normal mb-2">
                    Application submitted!
                </h3>
                <p className="text-sm text-graphite max-w-md">
                    Thank you for your interest in joining StartupKaro. We review every application carefully and will be in touch soon.
                </p>
            </div>
        );
    }

    return (
        <div id="apply" className="scroll-mt-20">
            <div className="border border-hairline rounded-2xl p-6 md:p-10 bg-canvas shadow-sm">
                <h2 className="font-serif text-2xl text-ink font-normal mb-1">Apply for this role</h2>
                <p className="text-sm text-graphite mb-8">All fields are required unless marked optional.</p>

                <form onSubmit={handleSubmit} noValidate className="space-y-7">

                    {/* Honeypot — hidden from real users, only bots fill this in.
                        Clipped to 1px rather than display:none since some bots
                        skip inputs that aren't rendered; no large offset, so it
                        can't push the page into horizontal overflow. */}
                    <input
                        ref={honeypotRef}
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute h-px w-px overflow-hidden opacity-0"
                    />

                    {/* Auto-filled fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <Label className={LABEL_CLASS}>Job ID</Label>
                            <Input
                                readOnly
                                disabled
                                value={job.jobId}
                                className={`${INPUT_BASE} ${INPUT_DEFAULT} cursor-default select-none bg-fog text-graphite`}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <Label className={LABEL_CLASS}>Position</Label>
                            <Input
                                readOnly
                                disabled
                                value={job.title}
                                className={`${INPUT_BASE} ${INPUT_DEFAULT} cursor-default select-none bg-fog text-graphite`}
                            />
                        </div>
                    </div>

                    <div className="h-px bg-fog" />

                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <Label className={LABEL_CLASS}>First Name</Label>
                            <Input
                                type="text"
                                value={form.firstName}
                                onChange={(e) => set("firstName", formatNameInput(e.target.value))}
                                placeholder="First Name"
                                autoComplete="given-name"
                                className={`${INPUT_BASE} ${errors.firstName ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.firstName && (
                                <p className="mt-1.5 text-xs text-error-brand">{errors.firstName}</p>
                            )}
                        </div>
                        <div>
                            <Label className={LABEL_CLASS}>
                                Middle Name <span className="normal-case text-stone">(optional)</span>
                            </Label>
                            <Input
                                type="text"
                                value={form.middleName}
                                onChange={(e) => set("middleName", formatNameInput(e.target.value))}
                                placeholder="Middle Name"
                                autoComplete="additional-name"
                                className={`${INPUT_BASE} ${INPUT_DEFAULT}`}
                            />
                        </div>
                        <div>
                            <Label className={LABEL_CLASS}>Last Name</Label>
                            <Input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => set("lastName", formatNameInput(e.target.value))}
                                placeholder="Last Name"
                                autoComplete="family-name"
                                className={`${INPUT_BASE} ${errors.lastName ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.lastName && (
                                <p className="mt-1.5 text-xs text-error-brand">{errors.lastName}</p>
                            )}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <Label className={LABEL_CLASS}>Email Address</Label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(e) => set("email", e.target.value)}
                                placeholder="Email"
                                autoComplete="email"
                                className={`${INPUT_BASE} ${errors.email ? INPUT_ERROR : INPUT_DEFAULT}`}
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-error-brand">{errors.email}</p>
                            )}
                        </div>
                        <div>
                            <Label className={LABEL_CLASS}>Mobile Number</Label>
                            <PhoneField
                                value={form.mobile}
                                onChange={(digits) => set("mobile", digits)}
                                error={!!errors.mobile}
                                className="h-auto rounded-xl bg-surface py-1"
                            />
                            {errors.mobile && (
                                <p className="mt-1.5 text-xs text-error-brand">{errors.mobile}</p>
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
                                    <SelectTrigger className={`h-11 rounded-xl bg-surface text-sm ${errors.experienceYears ? "border-error-brand" : "border-hairline"}`}>
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
                                    <SelectTrigger className="h-11 rounded-xl bg-surface text-sm border-hairline">
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
                            <p className="mt-1.5 text-xs text-error-brand">{errors.experienceYears}</p>
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
                                        className="border-hairline-strong data-[state=checked]:border-[#296ef9] data-[state=checked]:text-[#296ef9]"
                                    />
                                    <Label
                                        htmlFor={`current-ctc-${opt.value}`}
                                        className="text-sm text-charcoal cursor-pointer"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.currentCtc && (
                            <p className="mt-1.5 text-xs text-error-brand">{errors.currentCtc}</p>
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
                                        className="border-hairline-strong data-[state=checked]:border-[#296ef9] data-[state=checked]:text-[#296ef9]"
                                    />
                                    <Label
                                        htmlFor={`expected-ctc-${opt.value}`}
                                        className="text-sm text-charcoal cursor-pointer"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.expectedCtc && (
                            <p className="mt-1.5 text-xs text-error-brand">{errors.expectedCtc}</p>
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
                                        className="border-hairline-strong data-[state=checked]:border-[#296ef9] data-[state=checked]:text-[#296ef9]"
                                    />
                                    <Label
                                        htmlFor={`notice-${opt.value}`}
                                        className="text-sm text-charcoal cursor-pointer"
                                    >
                                        {opt.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.noticePeriod && (
                            <p className="mt-1.5 text-xs text-error-brand">{errors.noticePeriod}</p>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <Label className={LABEL_CLASS}>LinkedIn Profile URL</Label>
                        <Input
                            type="url"
                            value={form.linkedinUrl}
                            onChange={(e) => set("linkedinUrl", e.target.value)}
                            placeholder="LinkedIn URL"
                            className={`${INPUT_BASE} ${errors.linkedinUrl ? INPUT_ERROR : INPUT_DEFAULT}`}
                        />
                        {errors.linkedinUrl && (
                            <p className="mt-1.5 text-xs text-error-brand">{errors.linkedinUrl}</p>
                        )}
                    </div>

                    {/* Resume upload */}
                    <div>
                        <label className={LABEL_CLASS}>Resume</label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleResumeDrop}
                            onClick={() => resumeInputRef.current?.click()}
                            className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-200 ${
                                isDragging
                                    ? "border-primary-brand bg-tint-sky/30"
                                    : errors.resume
                                    ? "border-error-brand bg-surface"
                                    : "border-hairline-strong bg-surface hover:border-primary-brand hover:bg-tint-sky/20"
                            }`}
                        >
                            <input
                                ref={resumeInputRef}
                                type="file"
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="sr-only"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleResumeFile(file);
                                    e.target.value = "";
                                }}
                            />
                            {form.resume ? (
                                <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-hairline bg-canvas px-4 py-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <FileText className="h-5 w-5 shrink-0 text-primary-brand" />
                                        <span className="truncate text-sm text-ink">{form.resume.name}</span>
                                        <span className="shrink-0 text-xs text-graphite">
                                            ({(form.resume.size / 1024).toFixed(0)} KB)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Remove resume"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            set("resume", null);
                                        }}
                                        className="shrink-0 rounded-md p-1 text-graphite hover:bg-surface hover:text-ink transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className={`h-8 w-8 ${isDragging ? "text-primary-brand" : "text-graphite"}`} />
                                    <div>
                                        <p className="text-sm text-ink">
                                            <span className="font-medium text-primary-brand">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="mt-1 text-xs text-graphite">PDF or DOCX only</p>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline-strong bg-canvas px-3 py-1.5 text-xs text-charcoal">
                                        <Paperclip className="h-3.5 w-3.5" />
                                        Browse files
                                    </span>
                                </>
                            )}
                        </div>
                        {errors.resume && (
                            <p className="mt-1.5 text-xs text-error-brand">{errors.resume}</p>
                        )}
                    </div>

                    {/* Summary */}
                    <div>
                        <Label className={LABEL_CLASS}>
                            Summary, Achievements &amp; Work Links{" "}
                            <span className="normal-case text-stone">(optional)</span>
                        </Label>
                        <Textarea
                            value={form.summary}
                            onChange={(e) => set("summary", e.target.value)}
                            placeholder="Tell us about your key achievements, projects, portfolio links, or anything that sets you apart…"
                            rows={4}
                            className={`${INPUT_BASE} ${INPUT_DEFAULT} resize-none`}
                        />
                    </div>

                    <div className="h-px bg-fog" />

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
                                        className="border-hairline-strong data-[state=checked]:border-[#296ef9] data-[state=checked]:text-[#296ef9]"
                                    />
                                    <Label
                                        htmlFor={`criminal-${val}`}
                                        className="text-sm text-charcoal cursor-pointer"
                                    >
                                        {val}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        {errors.hasCriminalCase && (
                            <p className="mt-1.5 text-xs text-error-brand">{errors.hasCriminalCase}</p>
                        )}
                    </div>

                    {/* Agreement */}
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="agree"
                            checked={form.agreeToTerms}
                            onCheckedChange={(checked) => set("agreeToTerms", checked === true)}
                            className="mt-0.5 border-hairline-strong data-[state=checked]:bg-[#296ef9] data-[state=checked]:border-[#296ef9]"
                        />
                        <div>
                            <Label htmlFor="agree" className="text-sm text-charcoal cursor-pointer leading-relaxed">
                                I agree that all information provided above is accurate, failing which my employment could be impacted.
                                <span className="text-[#296ef9] ml-0.5">*</span>
                            </Label>
                            {errors.agreeToTerms && (
                                <p className="mt-1 text-xs text-error-brand">{errors.agreeToTerms}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit error */}
                    {errors.submit && (
                        <p className="text-sm text-error-brand text-center">{errors.submit}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl text-sm font-mono tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white bg-[#296ef9] hover:bg-[#296ef9]/90 shadow-sm shadow-[#296ef9]/20"
                    >
                        {loading ? "Submitting…" : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}
