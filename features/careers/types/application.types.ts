export type CurrentCTC = "0" | "2-5 LPA" | "5-8 LPA" | "8-11 LPA" | "Above 11 LPA";
export type ExpectedCTC = "2-5 LPA" | "5-8 LPA" | "8-11 LPA" | "Above 11 LPA";
export type NoticePeriod = "Join immediately" | "<30 days" | "31 to 60 days" | ">60 days";

export interface ApplicationFormState {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    mobile: string;
    experienceYears: string;
    experienceMonths: string;
    currentCtc: CurrentCTC | "";
    expectedCtc: ExpectedCTC | "";
    noticePeriod: NoticePeriod | "";
    linkedinUrl: string;
    summary: string;
    hasCriminalCase: "Yes" | "No" | "";
    agreeToTerms: boolean;
}

export interface ApplicationFormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
    experienceYears?: string;
    currentCtc?: string;
    expectedCtc?: string;
    noticePeriod?: string;
    linkedinUrl?: string;
    hasCriminalCase?: string;
    agreeToTerms?: string;
    submit?: string;
}

export interface ApplicationPayload {
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
}
