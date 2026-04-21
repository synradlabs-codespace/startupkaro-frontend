// features/marketing/components/CookiesPolicyPage.tsx

import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-4">{title}</h2>
            <div className="space-y-3 text-[15px] text-gray-600 leading-relaxed">{children}</div>
        </section>
    );
}

const cookieTable = [
    {
        name: "ph_*",
        provider: "PostHog",
        purpose: "Product analytics, tracks page views, events, and user sessions to help us understand usage",
        type: "Analytics",
        duration: "1 year",
    },
    {
        name: "sidebar:state",
        provider: "StartupKaro",
        purpose: "Remembers whether your sidebar is expanded or collapsed in the app panels",
        type: "Functional",
        duration: "7 days",
    },
    {
        name: "auth_token",
        provider: "StartupKaro",
        purpose: "Stores your authentication session token to keep you logged in",
        type: "Strictly necessary",
        duration: "Session / configurable",
    },
];

export function CookiesPolicyPage() {
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
                    <p className="text-xs tracking-[0.3em] uppercase font-mono font-medium text-[#6BAE3A] mb-3">Legal</p>
                    <h1 className="text-4xl font-serif font-normal text-gray-900 mb-3">Cookies &amp; Data Collection</h1>
                    <p className="text-sm text-gray-400">Last updated: April 9, 2026</p>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">

                <Section title="What Are Cookies?">
                    <p>
                        Cookies are small text files placed on your device by websites you visit. They are widely used to make
                        websites work efficiently, remember your preferences, and provide information to website owners.
                    </p>
                </Section>

                <Section title="How We Use Cookies">
                    <p>StartupKaro uses cookies for the following purposes:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>
                            <strong className="text-gray-900">Strictly necessary:</strong> Cookies required for core functionality such
                            as authentication and session management. These cannot be disabled.
                        </li>
                        <li>
                            <strong className="text-gray-900">Functional:</strong> Cookies that remember your preferences (e.g., sidebar state)
                            to improve your experience.
                        </li>
                        <li>
                            <strong className="text-gray-900">Analytics:</strong> Cookies used to collect anonymized data about how visitors
                            use our website, so we can improve it.
                        </li>
                    </ul>
                </Section>

                <Section title="PostHog Analytics">
                    <p>
                        We use <strong className="text-gray-900">PostHog</strong>, an open-source, privacy-focused product analytics platform, to
                        understand how our website and app are used. PostHog collects:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Pages visited and time spent on each page</li>
                        <li>Button clicks and form interaction events</li>
                        <li>Browser and device type</li>
                        <li>Approximate geographic location (country/city level, derived from IP)</li>
                        <li>Session recordings (if enabled), these capture UI interactions, not keystrokes or passwords</li>
                    </ul>
                    <p>
                        PostHog does not use your data for advertising and does not share it with third-party ad networks.
                        You can learn more at{" "}
                        <span className="text-gray-800 font-medium">posthog.com</span>.
                    </p>
                    <p>
                        IP addresses collected by PostHog may be used to derive location data and are subsequently anonymized
                        or truncated in accordance with PostHog's data processing practices.
                    </p>
                </Section>

                <Section title="Cookies We Set">
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase tracking-wider">Cookie</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase tracking-wider">Provider</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase tracking-wider">Purpose</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase tracking-wider">Type</th>
                                    <th className="text-left px-4 py-3 font-medium text-gray-700 text-xs uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {cookieTable.map((row) => (
                                    <tr key={row.name} className="bg-white">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-800 whitespace-nowrap">{row.name}</td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.provider}</td>
                                        <td className="px-4 py-3 text-gray-500">{row.purpose}</td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.type}</td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                <Section title="Your Choices">
                    <p>
                        <strong className="text-gray-900">Browser settings:</strong> You can configure your browser to refuse all cookies or
                        to alert you when cookies are being set. Note that disabling strictly necessary cookies will prevent
                        core site functionality from working (e.g., you will not be able to log in).
                    </p>
                    <p>
                        <strong className="text-gray-900">Opt-out of analytics:</strong> If you do not wish to be tracked by PostHog, you can
                        use a browser extension that blocks analytics scripts (such as uBlock Origin), or enable
                        &quot;Do Not Track&quot; in your browser settings, PostHog respects this signal where configured.
                    </p>
                </Section>

                <Section title="Data Collected Beyond Cookies">
                    <p>
                        In addition to cookies, we may collect technical data server-side, including your IP address, referrer URL,
                        and request metadata for security and fraud prevention purposes. This data is not used for advertising.
                        For full details, see our{" "}
                        <Link href="/privacy-policy" className="text-[#FF9933] hover:underline">Privacy Policy</Link>.
                    </p>
                </Section>

                <Section title="Changes to This Policy">
                    <p>
                        We may update this Cookies Policy as we adopt new tools or change our practices. Updates will be reflected
                        on this page with a revised date.
                    </p>
                </Section>

                <Section title="Contact">
                    <p>
                        Questions about our use of cookies? Email us at{" "}
                        <a href="mailto:hello@startupkaro.in" className="text-[#FF9933] hover:underline">
                            hello@startupkaro.in
                        </a>.
                    </p>
                </Section>
            </div>
        </div>
    );
}
