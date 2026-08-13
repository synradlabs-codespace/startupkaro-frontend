import type { ApiResponse } from "@/types/api.types";
import type { ApplicationPayload } from "@/features/careers/types/application.types";

/**
 * Submits a job application to our own `app/api/careers/apply` route handler,
 * which emails it (with the resume attached) via Resend — see docs/API_MISMATCHES.md
 * for why this bypasses the backend (its /careers/applications route doesn't exist).
 *
 * Deliberately NOT using `apiClient`: its baseURL points at the external
 * backend, it forces JSON (a File can't survive JSON.stringify — that was the
 * original bug), and its 401 interceptor would wrongly clear an applicant's
 * unrelated session on error.
 */
export async function submitJobApplication(payload: ApplicationPayload & { honeypot?: string }) {
    const formData = new FormData();
    formData.append("jobId", payload.jobId);
    formData.append("jobTitle", payload.jobTitle);
    formData.append("submittedAt", payload.submittedAt);
    formData.append("firstName", payload.firstName);
    if (payload.middleName) formData.append("middleName", payload.middleName);
    formData.append("lastName", payload.lastName);
    formData.append("email", payload.email);
    formData.append("mobile", payload.mobile);
    formData.append("experienceYears", String(payload.experienceYears));
    formData.append("experienceMonths", String(payload.experienceMonths));
    formData.append("currentCtc", payload.currentCtc);
    formData.append("expectedCtc", payload.expectedCtc);
    formData.append("noticePeriod", payload.noticePeriod);
    formData.append("linkedinUrl", payload.linkedinUrl);
    if (payload.summary) formData.append("summary", payload.summary);
    formData.append("hasCriminalCase", String(payload.hasCriminalCase));
    formData.append("agreeToTerms", "true");
    formData.append("resume", payload.resume);
    formData.append("company", payload.honeypot ?? "");

    const res = await fetch("/api/careers/apply", { method: "POST", body: formData });
    const data = (await res.json()) as ApiResponse<{ id: string } | null> & { errors?: { field: string; message: string }[] };

    if (!res.ok || !data.success) {
        // Shaped so getApiErrorMessage/mapServerFieldErrors (lib/api-messages.ts)
        // can read it the same way they read an axios error's response.data.
        throw { response: { data } };
    }

    return data;
}
