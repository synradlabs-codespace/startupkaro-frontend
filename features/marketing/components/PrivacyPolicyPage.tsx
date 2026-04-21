// features/marketing/components/PrivacyPolicyPage.tsx

import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">{title}</h2>
            <div className="space-y-3 text-[15px] text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}

export function PrivacyPolicyPage() {
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
                    <h1 className="text-4xl font-serif font-normal text-gray-900 mb-3">Privacy Policy</h1>
                    <p className="text-sm text-gray-400">Last updated: April 9, 2026</p>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">

                <Section title="Overview">
                    <p>
                        StartupKaro (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website startupkaro.in and provides business
                        compliance and registration services. This Privacy Policy explains how we collect, use, store, and share
                        information when you visit our website or use our services.
                    </p>
                    <p>
                        By using our website or services, you agree to the collection and use of information as described in this policy.
                    </p>
                </Section>

                <Section title="Information We Collect">
                    <p><strong className="text-gray-900">Information you provide directly:</strong></p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Name, email address, and phone number when you contact us or sign up</li>
                        <li>Business details such as PAN, Aadhaar, address proof, and company name when you place an order for a service</li>
                        <li>Payment information (we do not store card details; payments are processed via third-party gateways)</li>
                        <li>Messages and correspondence you send us through our contact form</li>
                    </ul>
                    <p className="mt-2"><strong className="text-gray-900">Information collected automatically:</strong></p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Browser type, device type, and operating system</li>
                        <li>Pages visited, time spent on pages, and referring URLs</li>
                        <li>IP address and approximate geographic location</li>
                        <li>Interaction events such as button clicks and form interactions</li>
                    </ul>
                    <p className="mt-2">
                        We use <strong className="text-gray-900">PostHog</strong>, an open-source product analytics platform, to collect
                        behavioral and usage data to understand how visitors interact with our website. PostHog may set cookies on
                        your device. See our <Link href="/cookies-policy" className="text-[#FF9933] hover:underline">Cookies Policy</Link> for details.
                    </p>
                </Section>

                <Section title="How We Use Your Information">
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>To deliver and manage the services you have purchased</li>
                        <li>To communicate with you about your order status, documents, and compliance deadlines</li>
                        <li>To respond to your inquiries and support requests</li>
                        <li>To send you service updates or relevant legal/compliance reminders (you can opt out at any time)</li>
                        <li>To analyse website usage and improve our product experience via PostHog analytics</li>
                        <li>To comply with legal obligations, including record-keeping requirements under Indian law</li>
                    </ul>
                </Section>

                <Section title="Sharing of Information">
                    <p>We do not sell or rent your personal information. We may share your information with:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>
                            <strong className="text-gray-900">Assigned professionals:</strong> The CA, CS, or legal expert handling your specific service case.
                        </li>
                        <li>
                            <strong className="text-gray-900">Government portals:</strong> We submit your information to relevant portals (MCA, GST Portal, DGFT, IP India, etc.)
                            on your behalf as required to complete the service.
                        </li>
                        <li>
                            <strong className="text-gray-900">Payment processors:</strong> Your payment is processed by third-party gateways. We do not store card or UPI credentials.
                        </li>
                        <li>
                            <strong className="text-gray-900">Analytics providers:</strong> PostHog receives anonymized usage data. See our{" "}
                            <Link href="/cookies-policy" className="text-[#FF9933] hover:underline">Cookies Policy</Link>.
                        </li>
                        <li>
                            <strong className="text-gray-900">Legal requirements:</strong> We may disclose information if required by law, court order, or government authority.
                        </li>
                    </ul>
                </Section>

                <Section title="Data Retention">
                    <p>
                        We retain your personal and business data for as long as necessary to fulfil the service and meet our legal obligations.
                        For most compliance and registration documents, Indian law requires records to be maintained for a minimum of 8 years.
                        You may request deletion of your account data by contacting us at{" "}
                        <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">hello@startupkaro.in</a>.
                        Note that data submitted to government portals on your behalf cannot be deleted by us.
                    </p>
                </Section>

                <Section title="Data Security">
                    <p>
                        We use industry-standard measures to protect your data, including HTTPS encryption, access controls, and secure
                        server infrastructure. However, no transmission over the internet is 100% secure. We encourage you to keep your
                        account credentials confidential.
                    </p>
                </Section>

                <Section title="Your Rights">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your account data (subject to legal retention requirements)</li>
                        <li>Opt out of marketing communications</li>
                        <li>Withdraw consent for analytics tracking via cookie preferences</li>
                    </ul>
                    <p>To exercise any of these rights, email us at{" "}
                        <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">hello@startupkaro.in</a>.
                    </p>
                </Section>

                <Section title="Third-Party Links">
                    <p>
                        Our website may contain links to government portals and third-party websites. We are not responsible for the
                        privacy practices of those sites.
                    </p>
                </Section>

                <Section title="Children's Privacy">
                    <p>
                        Our services are intended for individuals 18 years of age or older. We do not knowingly collect personal
                        information from minors.
                    </p>
                </Section>

                <Section title="Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. The updated version will be posted on this page with
                        a revised &quot;Last updated&quot; date. Continued use of our services after changes constitutes acceptance.
                    </p>
                </Section>

                <Section title="Contact Us">
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                        <p className="font-medium text-gray-900">StartupKaro</p>
                        <p className="text-gray-500 mt-1">Mohali, Punjab, India</p>
                        <p className="text-gray-500">
                            Email:{" "}
                            <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">
                                hello@startupkaro.in
                            </a>
                        </p>
                        <p className="text-gray-500">Phone: +91 789 00000 88</p>
                    </div>
                </Section>
            </div>
        </div>
    );
}
