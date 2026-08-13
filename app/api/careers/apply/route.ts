import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { ApiResponse } from "@/types/api.types";
import { validators, validatePhoneDigits } from "@/lib/validations/common.schema";
import { renderJobApplicationEmail, sanitizeDisplayName } from "@/lib/emails/job-application";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CAREERS_TO_EMAIL = process.env.CAREERS_TO_EMAIL || "contact@startupkaro.in";
const CAREERS_FROM_EMAIL = process.env.CAREERS_FROM_EMAIL || "careers@startupkaro.in";

const MAX_RESUME_BYTES = 4 * 1024 * 1024; // 4MB — see docs/API_MISMATCHES.md for why (Netlify Function payload limit)
const ACCEPTED_RESUME_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ACCEPTED_RESUME_EXT = [".pdf", ".docx"];

const CURRENT_CTC_VALUES = ["0", "2-5 LPA", "5-8 LPA", "8-11 LPA", "Above 11 LPA"];
const EXPECTED_CTC_VALUES = ["2-5 LPA", "5-8 LPA", "8-11 LPA", "Above 11 LPA"];
const NOTICE_PERIOD_VALUES = ["Join immediately", "<30 days", "31 to 60 days", ">60 days"];
const LINKEDIN_PATTERN = /^https?:\/\/(www\.)?linkedin\.com\/in\//;

interface FieldError {
    field: string;
    message: string;
}

function json(body: ApiResponse<{ id: string } | null> & { errors?: FieldError[] }, status: number) {
    return NextResponse.json(body, { status });
}

// --- Rate limiting -----------------------------------------------------
// Best-effort only: Netlify Functions are serverless, so this module-scoped
// map is per-instance and short-lived, not a fleet-wide guarantee. Combined
// with the honeypot and strict server-side validation below, this is
// proportionate for a low-volume careers form. See docs/API_MISMATCHES.md.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    timestamps.push(now);
    submissionsByIp.set(ip, timestamps);
    return timestamps.length > RATE_LIMIT_MAX;
}

function clientIp(req: NextRequest): string {
    const forwardedFor = req.headers.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    return req.headers.get("x-real-ip") || "unknown";
}

// --- Field validation ----------------------------------------------------

function validateFields(fields: Record<string, string>): FieldError[] {
    const errors: FieldError[] = [];
    const push = (field: string, message: string | null) => {
        if (message) errors.push({ field, message });
    };

    push("firstName", validators.name(fields.firstName ?? ""));
    push("lastName", validators.name(fields.lastName ?? ""));
    push("email", validators.email(fields.email ?? ""));
    push("mobile", validatePhoneDigits((fields.mobile ?? "").replace(/^\+91/, ""), true) || null);

    if (!fields.jobId?.trim()) push("jobId", "Missing job reference");
    if (!fields.jobTitle?.trim()) push("jobTitle", "Missing job reference");

    if (!CURRENT_CTC_VALUES.includes(fields.currentCtc)) push("currentCtc", "Please select your current CTC");
    if (!EXPECTED_CTC_VALUES.includes(fields.expectedCtc)) push("expectedCtc", "Please select your expected CTC");
    if (!NOTICE_PERIOD_VALUES.includes(fields.noticePeriod)) push("noticePeriod", "Please select a notice period");

    if (!fields.linkedinUrl?.trim() || !LINKEDIN_PATTERN.test(fields.linkedinUrl.trim())) {
        push("linkedinUrl", "Enter a valid LinkedIn profile URL (linkedin.com/in/…)");
    }

    if (fields.hasCriminalCase !== "true" && fields.hasCriminalCase !== "false") {
        push("hasCriminalCase", "Please select an answer");
    }

    if (fields.agreeToTerms !== "true") {
        push("agreeToTerms", "You must confirm the accuracy of information provided");
    }

    const experienceYears = Number(fields.experienceYears);
    if (!Number.isFinite(experienceYears) || experienceYears < 0) {
        push("experienceYears", "Select years of experience");
    }

    return errors;
}

export async function POST(req: NextRequest) {
    if (!RESEND_API_KEY) {
        return json({ data: null, success: false, message: "Job applications are not configured yet." }, 200);
    }

    if (isRateLimited(clientIp(req))) {
        return json(
            { data: null, success: false, message: "Too many submissions. Please try again in a few minutes." },
            429
        );
    }

    let form: FormData;
    try {
        form = await req.formData();
    } catch {
        return json({ data: null, success: false, message: "Invalid submission." }, 400);
    }

    const get = (key: string) => (form.get(key) ?? "").toString();

    // Honeypot: real applicants never fill this hidden field. Report success
    // without sending mail so bots stop retrying.
    if (get("company").trim()) {
        return json({ data: { id: "ignored" }, success: true, message: "Application submitted" }, 200);
    }

    const fields = {
        jobId: get("jobId"),
        jobTitle: get("jobTitle"),
        submittedAt: get("submittedAt") || new Date().toISOString(),
        firstName: get("firstName").trim(),
        middleName: get("middleName").trim(),
        lastName: get("lastName").trim(),
        email: get("email").trim(),
        mobile: get("mobile").trim(),
        experienceYears: get("experienceYears"),
        experienceMonths: get("experienceMonths"),
        currentCtc: get("currentCtc"),
        expectedCtc: get("expectedCtc"),
        noticePeriod: get("noticePeriod"),
        linkedinUrl: get("linkedinUrl").trim(),
        summary: get("summary").trim(),
        hasCriminalCase: get("hasCriminalCase"),
        agreeToTerms: get("agreeToTerms"),
    };

    const fieldErrors = validateFields(fields);

    const resume = form.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
        fieldErrors.push({ field: "resume", message: "Please upload your resume" });
    } else {
        const validType =
            ACCEPTED_RESUME_TYPES.includes(resume.type) ||
            ACCEPTED_RESUME_EXT.some((ext) => resume.name.toLowerCase().endsWith(ext));
        if (!validType) {
            fieldErrors.push({ field: "resume", message: "Only PDF or DOCX files are accepted" });
        } else if (resume.size > MAX_RESUME_BYTES) {
            fieldErrors.push({ field: "resume", message: "Resume must be under 4 MB" });
        }
    }

    if (fieldErrors.length > 0) {
        return json({ data: null, success: false, message: "Please fix the highlighted fields.", errors: fieldErrors }, 400);
    }

    const resumeFile = resume as File;

    try {
        const resend = new Resend(RESEND_API_KEY);
        const { html, text } = renderJobApplicationEmail({
            jobId: fields.jobId,
            jobTitle: fields.jobTitle,
            submittedAt: fields.submittedAt,
            firstName: fields.firstName,
            middleName: fields.middleName || undefined,
            lastName: fields.lastName,
            email: fields.email,
            mobile: fields.mobile,
            experienceYears: Number(fields.experienceYears),
            experienceMonths: Number(fields.experienceMonths) || 0,
            currentCtc: fields.currentCtc,
            expectedCtc: fields.expectedCtc,
            noticePeriod: fields.noticePeriod,
            linkedinUrl: fields.linkedinUrl,
            summary: fields.summary || undefined,
            hasCriminalCase: fields.hasCriminalCase === "true",
            resumeFilename: resumeFile.name,
        });

        const displayName = sanitizeDisplayName(`${fields.firstName} ${fields.lastName}`);
        const attachmentBuffer = Buffer.from(await resumeFile.arrayBuffer());

        const result = await resend.emails.send({
            from: `${displayName} (Job Application) <${CAREERS_FROM_EMAIL}>`,
            to: CAREERS_TO_EMAIL,
            replyTo: fields.email,
            subject: `New application: ${fields.jobTitle} — ${displayName}`,
            html,
            text,
            attachments: [{ filename: resumeFile.name, content: attachmentBuffer }],
        });

        if (result.error) {
            return json({ data: null, success: false, message: result.error.message || "Failed to send application." }, 502);
        }

        return json({ data: { id: result.data?.id ?? "" }, success: true, message: "Application submitted" }, 200);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again or contact us directly.";
        return json({ data: null, success: false, message }, 502);
    }
}
