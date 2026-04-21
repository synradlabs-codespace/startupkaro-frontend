// features/marketing/components/TermsOfServicePage.tsx

import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">{title}</h2>
            <div className="space-y-3 text-[15px] text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}

export function TermsOfServicePage() {
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
                    <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#000080] mb-3">Legal</p>
                    <h1 className="text-4xl font-serif font-normal text-gray-900 mb-3">Terms of Service</h1>
                    <p className="text-sm text-gray-400">Last updated: April 9, 2026</p>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">

                <Section title="Acceptance of Terms">
                    <p>
                        By accessing or using the StartupKaro website (startupkaro.in) or any of our services, you agree to be
                        bound by these Terms of Service (&quot;Terms&quot;). If you do not agree, please do not use our services.
                    </p>
                    <p>
                        These Terms apply to all visitors, customers, and registered users of StartupKaro. We reserve the right
                        to update these Terms at any time. Continued use of our services after an update constitutes acceptance
                        of the revised Terms.
                    </p>
                </Section>

                <Section title="Services">
                    <p>
                        StartupKaro provides business compliance and registration services including, but not limited to: GST registration,
                        company incorporation, trademark filing, income tax return filing, FSSAI licensing, and import-export code registration.
                    </p>
                    <p>
                        All services are delivered through qualified professionals, Chartered Accountants (CAs), Company Secretaries (CSs),
                        and legal professionals, assigned on a case-by-case basis.
                    </p>
                    <p>
                        We act as a facilitator and professional service provider. We do not guarantee outcomes that are subject to
                        discretionary decisions of government authorities (e.g., trademark approval, MCA name availability).
                    </p>
                </Section>

                <Section title="User Responsibilities">
                    <p>You agree to:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Provide accurate, complete, and up-to-date information when placing an order or filling any form</li>
                        <li>Upload genuine documents, submitting forged or fraudulent documents is illegal and will result in immediate service termination</li>
                        <li>Respond promptly to requests for additional information or document verification</li>
                        <li>Keep your account credentials confidential and notify us of any unauthorised access</li>
                        <li>Use our services only for lawful business purposes</li>
                    </ul>
                    <p>
                        You are solely responsible for the accuracy of information provided. Delays or rejections arising from
                        incorrect or incomplete information provided by you are not our liability.
                    </p>
                </Section>

                <Section title="Payment Terms">
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>All prices are listed in Indian Rupees (INR) inclusive of government fees where stated</li>
                        <li>Payment is due upfront before service commencement unless otherwise agreed in writing</li>
                        <li>We accept payments via the gateways listed on our checkout page</li>
                        <li>Invoices and receipts will be issued electronically</li>
                    </ul>
                </Section>

                <Section title="Refunds">
                    <p>
                        Refund eligibility and amounts are determined solely at the discretion of StartupKaro. Please review our{" "}
                        <Link href="/refund-policy" className="text-[#FF9933] hover:underline">Refund Policy</Link> for details.
                    </p>
                </Section>

                <Section title="Intellectual Property">
                    <p>
                        All content on the StartupKaro website, including text, graphics, logos, service descriptions, and
                        software, is the property of StartupKaro and is protected under applicable intellectual property laws.
                        You may not reproduce, distribute, or use our content without prior written consent.
                    </p>
                </Section>

                <Section title="Limitation of Liability">
                    <p>
                        To the maximum extent permitted by law, StartupKaro shall not be liable for any indirect, incidental,
                        special, or consequential damages arising from the use or inability to use our services.
                    </p>
                    <p>
                        Our total liability for any claim arising from our services shall not exceed the amount paid by you for
                        the specific service that gave rise to the claim.
                    </p>
                    <p>
                        We are not liable for delays or service failures caused by government portals, third-party systems,
                        force majeure events, or your failure to provide required information or documents on time.
                    </p>
                </Section>

                <Section title="Disclaimer of Warranties">
                    <p>
                        Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied.
                        We do not warrant that our services will be uninterrupted, error-free, or that any specific outcome
                        (such as trademark registration approval) will be achieved.
                    </p>
                </Section>

                <Section title="Governing Law & Jurisdiction">
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
                        arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction
                        of the courts in Mohali, Punjab, India.
                    </p>
                </Section>

                <Section title="Termination">
                    <p>
                        We reserve the right to suspend or terminate your access to our services at any time if you violate
                        these Terms, provide fraudulent information, or engage in any conduct that we determine to be harmful
                        to StartupKaro or other users.
                    </p>
                </Section>

                <Section title="Privacy">
                    <p>
                        Your use of our services is also governed by our{" "}
                        <Link href="/privacy-policy" className="text-[#FF9933] hover:underline">Privacy Policy</Link>, which is
                        incorporated into these Terms by reference.
                    </p>
                </Section>

                <Section title="Contact">
                    <p>For questions about these Terms, contact us:</p>
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                        <p className="font-medium text-gray-900">StartupKaro</p>
                        <p className="text-gray-500 mt-1">Mohali, Punjab, India</p>
                        <p className="text-gray-500">
                            Email:{" "}
                            <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">
                                hello@startupkaro.in
                            </a>
                        </p>
                    </div>
                </Section>
            </div>
        </div>
    );
}
