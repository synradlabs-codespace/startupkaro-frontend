// features/marketing/components/RefundPolicyPage.tsx

import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">{title}</h2>
            <div className="space-y-3 text-[15px] text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}

export function RefundPolicyPage() {
    return (
        <div className="bg-white">
            {/* Header */}
            <div className="relative border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-16">
                <div className="absolute top-0 left-0 right-0 flex h-1">
                    <div className="flex-1 bg-[#FF9933]" />
                    <div className="flex-1 bg-white border-t border-gray-200" />
                    <div className="flex-1 bg-[#6BAE3A]" />
                </div>
                <div className="mx-auto max-w-3xl">
                    <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#FF9933] mb-3">Legal</p>
                    <h1 className="text-4xl font-serif font-normal text-gray-900 mb-3">Refund Policy</h1>
                    <p className="text-sm text-gray-400">Last updated: April 9, 2026</p>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">

                <div className="mb-10 p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                    <p className="text-sm text-amber-800 leading-relaxed">
                        <strong>Important:</strong> All refund decisions are made solely at the discretion of StartupKaro.
                        Submitting a refund request does not guarantee approval. Please read this policy in full before
                        purchasing any service.
                    </p>
                </div>

                <Section title="Overview">
                    <p>
                        StartupKaro provides professional compliance and registration services that involve significant human effort,
                        government interaction, and third-party costs — often from the moment your order is placed. Because of the
                        nature of these services, all refund decisions are made solely at the discretion of StartupKaro on a
                        case-by-case basis.
                    </p>
                    <p>
                        There is no automatic right to a refund. We evaluate each request individually based on the circumstances
                        described below.
                    </p>
                </Section>

                <Section title="Non-Refundable Components">
                    <p>The following amounts are non-refundable under any circumstances:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>
                            <strong className="text-gray-900">Government fees:</strong> Any fees paid to government portals (e.g., MCA, GST Portal, DGFT, IP India)
                            on your behalf are non-recoverable and cannot be refunded.
                        </li>
                        <li>
                            <strong className="text-gray-900">Digital Signature Certificate (DSC) costs:</strong> Once a DSC is issued, the associated cost cannot be refunded.
                        </li>
                        <li>
                            <strong className="text-gray-900">Services already delivered:</strong> Where a service or a defined milestone has been fully completed and
                            delivered, no refund will be issued for that component.
                        </li>
                        <li>
                            <strong className="text-gray-900">Delays caused by you:</strong> If your order is delayed or rejected due to incorrect information or
                            documents submitted by you, no refund is applicable.
                        </li>
                    </ul>
                </Section>

                <Section title="Circumstances Where a Refund May Be Considered">
                    <p>
                        StartupKaro may, at its sole discretion, consider a partial or full refund in the following situations:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>We are unable to begin the service due to reasons within our control</li>
                        <li>A significant delay in service delivery has occurred that is directly attributable to our team</li>
                        <li>A service was incorrectly sold to you (e.g., wrong licence type recommended by our team)</li>
                        <li>A duplicate payment was made in error</li>
                    </ul>
                    <p>
                        Even in these circumstances, the refund amount and timing remain at the sole discretion of StartupKaro.
                        We may choose to offer a service credit, partial refund, or full refund depending on the situation.
                    </p>
                </Section>

                <Section title="Government-Mandated Rejections">
                    <p>
                        Some services — such as trademark registration or company name approval — involve outcomes that are
                        subject to government discretion. A rejection by a government authority does not automatically entitle
                        you to a refund of professional fees, as our team has already invested effort in preparing and filing
                        your application. Refund eligibility in such cases will be assessed individually.
                    </p>
                </Section>

                <Section title="How to Request a Refund">
                    <p>To submit a refund request, email us at{" "}
                        <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">
                            hello@startupkaro.in
                        </a>{" "}
                        with:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Your order ID or registered email address</li>
                        <li>The service for which you are requesting a refund</li>
                        <li>A clear reason for your request</li>
                    </ul>
                    <p>
                        We will acknowledge your request within 2 business days and communicate our decision within 7 business days.
                        If approved, refunds will be processed to the original payment method within 5–10 business days depending
                        on your bank or payment provider.
                    </p>
                </Section>

                <Section title="Chargebacks">
                    <p>
                        Initiating a chargeback with your bank without first contacting us to resolve the issue is a violation
                        of our Terms of Service. We reserve the right to dispute any chargeback with appropriate evidence and
                        may suspend your account pending resolution.
                    </p>
                </Section>

                <Section title="Changes to This Policy">
                    <p>
                        This Refund Policy may be updated from time to time. The version in effect at the time of your purchase
                        governs your order. We encourage you to review this page before placing an order.
                    </p>
                </Section>

                <Section title="Related Policies">
                    <p>
                        This Refund Policy should be read alongside our{" "}
                        <Link href="/terms-of-service" className="text-[#FF9933] hover:underline">Terms of Service</Link> and{" "}
                        <Link href="/privacy-policy" className="text-[#FF9933] hover:underline">Privacy Policy</Link>.
                    </p>
                </Section>

                <Section title="Contact">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                        <p className="font-medium text-gray-900">StartupKaro — Refund Requests</p>
                        <p className="text-gray-500 mt-1">
                            Email:{" "}
                            <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">
                                hello@startupkaro.in
                            </a>
                        </p>
                        <p className="text-gray-500">Phone: +91 789 00000 88</p>
                        <p className="text-gray-500">Business hours: Mon–Sat, 10am–6pm IST</p>
                    </div>
                </Section>
            </div>
        </div>
    );
}
