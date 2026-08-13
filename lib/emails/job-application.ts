// lib/emails/job-application.ts
// Renders the internal notification email sent to CAREERS_TO_EMAIL whenever a
// candidate submits the careers application form. Rendered and sent entirely
// from this repo via app/api/careers/apply/route.ts — see docs/resend-templates/README.md.
//
// All applicant-supplied values are escaped before interpolation into HTML;
// this data is untrusted public input.

export interface JobApplicationEmailData {
    jobId: string;
    jobTitle: string;
    submittedAt: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    mobile: string;
    experienceYears: number;
    experienceMonths: number;
    currentCtc: string;
    expectedCtc: string;
    noticePeriod: string;
    linkedinUrl: string;
    summary?: string;
    hasCriminalCase: boolean;
    resumeFilename: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function fullName(data: JobApplicationEmailData): string {
    return [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
}

function row(label: string, value: string): string {
    return `
    <tr>
      <td style="padding:8px 16px;border-bottom:1px solid #e8e8e8;color:#636363;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
      <td style="padding:8px 16px;border-bottom:1px solid #e8e8e8;color:#1a1a1a;font-size:13px;">${value}</td>
    </tr>`;
}

export function renderJobApplicationEmail(data: JobApplicationEmailData): { html: string; text: string } {
    const name = fullName(data);
    const experience = `${data.experienceYears} yr${data.experienceYears === 1 ? "" : "s"} ${data.experienceMonths} mo`;
    const linkedin = escapeHtml(data.linkedinUrl);

    const rows = [
        row("Applicant", escapeHtml(name)),
        row("Email", `<a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>`),
        row("Mobile", escapeHtml(data.mobile)),
        row("Experience", escapeHtml(experience)),
        row("Current CTC", escapeHtml(data.currentCtc)),
        row("Expected CTC", escapeHtml(data.expectedCtc)),
        row("Notice period", escapeHtml(data.noticePeriod)),
        row("LinkedIn", `<a href="${linkedin}">${linkedin}</a>`),
        row("Any criminal case pending?", data.hasCriminalCase ? "Yes" : "No"),
    ];

    if (data.summary) {
        rows.push(row("Summary", escapeHtml(data.summary).replace(/\n/g, "<br/>")));
    }

    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;">
  <h2 style="color:#1a1a1a;font-size:18px;margin-bottom:4px;">New job application</h2>
  <p style="color:#636363;font-size:13px;margin-top:0;">
    ${escapeHtml(data.jobTitle)} <span style="color:#c2c2c2;">(${escapeHtml(data.jobId)})</span>
    &middot; submitted ${escapeHtml(new Date(data.submittedAt).toLocaleString("en-IN"))}
  </p>
  <table style="width:100%;border-collapse:collapse;margin-top:12px;">
    ${rows.join("")}
  </table>
  <p style="color:#636363;font-size:13px;margin-top:16px;">
    Resume attached: ${escapeHtml(data.resumeFilename)}
  </p>
  <p style="color:#636363;font-size:12px;margin-top:24px;">
    Reply to this email to respond directly to the candidate.
  </p>
</div>`.trim();

    const textLines = [
        `New job application: ${data.jobTitle} (${data.jobId})`,
        `Submitted: ${new Date(data.submittedAt).toLocaleString("en-IN")}`,
        "",
        `Applicant: ${name}`,
        `Email: ${data.email}`,
        `Mobile: ${data.mobile}`,
        `Experience: ${experience}`,
        `Current CTC: ${data.currentCtc}`,
        `Expected CTC: ${data.expectedCtc}`,
        `Notice period: ${data.noticePeriod}`,
        `LinkedIn: ${data.linkedinUrl}`,
        `Any criminal case pending?: ${data.hasCriminalCase ? "Yes" : "No"}`,
    ];
    if (data.summary) textLines.push("", `Summary: ${data.summary}`);
    textLines.push("", `Resume attached: ${data.resumeFilename}`, "", "Reply to this email to respond directly to the candidate.");

    return { html, text: textLines.join("\n") };
}

/** Strips characters that could break out of a "Display Name <addr>" From header (CRLF, quotes, angle brackets). */
export function sanitizeDisplayName(raw: string): string {
    return raw.replace(/[\r\n"<>]/g, "").trim();
}
