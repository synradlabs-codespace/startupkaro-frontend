// features/marketing/components/CookiesPolicyPage.tsx

import Link from "next/link";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="text-xl font-display font-semibold text-ink mb-4">{title}</h2>
            <div className="space-y-3 text-[15px] text-slate leading-relaxed">{children}</div>
        </section>
    );
}

export function CookiesPolicyPage() {
    return (
        <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8 pb-6 space-y-4">
            {/* Header */}
            <div className="bg-canvas rounded-2xl px-4 pb-12 pt-7 sm:px-6 md:pt-11 lg:px-8">
                <div className="max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-[0.28px] text-steel mb-3">Legal</p>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-ink mb-3">Cookies &amp; Data Collection</h1>
                    <p className="text-sm text-stone">Last updated: August 14, 2026</p>
                </div>
            </div>

            {/* Body */}
            <div className="bg-canvas rounded-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">

                <Section title="What Are Cookies?">
                    <p>
                        Cookies are small text files placed on your device by websites you visit. They are widely used to make
                        websites work efficiently, remember your preferences, and provide information to website owners.
                    </p>
                </Section>

                <Section title="How We Use Cookies">
                    <p>Startupkaro private limited uses cookies for the following purposes:</p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>
                            <strong className="text-ink">Strictly necessary:</strong> Cookies required for core functionality such
                            as authentication and session management. These cannot be disabled.
                        </li>
                        <li>
                            <strong className="text-ink">Functional:</strong> Cookies that remember your preferences (e.g., sidebar state)
                            to improve your experience.
                        </li>
                        <li>
                            <strong className="text-ink">Analytics:</strong> Cookies used to collect anonymized data about how visitors
                            use our website, so we can improve it.
                        </li>
                    </ul>
                </Section>

                <Section title="Analytics & Product Insights">
                    <p>
                        We use third-party analytics tools to understand how our website and app are used. Depending on the
                        page, these tools may collect:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>Pages visited and time spent on each page</li>
                        <li>Button clicks and form interaction events</li>
                        <li>Browser and device type</li>
                        <li>Approximate geographic location (country/city level, derived from IP)</li>
                        <li>Session recordings (if enabled), these capture UI interactions, not keystrokes or passwords</li>
                    </ul>
                    <p>
                        This data is not used for advertising and is not shared with third-party ad networks. We are not
                        obligated to, and do not, disclose the identity of the specific analytics or technology partners we use.
                    </p>
                    <p>
                        Authorized Startupkaro private limited staff can view aggregated, anonymized visitor statistics (such as visitor counts and
                        popular pages) through our internal admin tools. This internal view does not identify individual visitors.
                    </p>
                </Section>

                <Section title="Cookies We Set">
                    <p>
                        We do not publish a list of individual cookie names, as this changes as our tools evolve and we are not
                        obligated to disclose it. In general, the cookies we and our service providers set fall into the
                        categories described above:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li>
                            <strong className="text-ink">Strictly necessary cookies</strong> typically last for your browser session or a short
                            configurable period, and keep you signed in.
                        </li>
                        <li>
                            <strong className="text-ink">Functional cookies</strong> typically last a few days to a few weeks, and remember
                            interface preferences such as panel or sidebar state.
                        </li>
                        <li>
                            <strong className="text-ink">Analytics cookies</strong> typically last up to a year, and help us recognise repeat
                            visits for usage statistics.
                        </li>
                    </ul>
                </Section>

                <Section title="Your Choices">
                    <p>
                        <strong className="text-ink">Browser settings:</strong> You can configure your browser to refuse all cookies or
                        to alert you when cookies are being set. Note that disabling strictly necessary cookies will prevent
                        core site functionality from working (e.g., you will not be able to log in).
                    </p>
                    <p>
                        <strong className="text-ink">Opt-out of analytics:</strong> If you do not wish to be tracked by our analytics tools,
                        you can decline analytics cookies through the cookie consent banner, use a browser extension that blocks
                        analytics scripts, or enable &quot;Do Not Track&quot; in your browser settings.
                    </p>
                </Section>

                <Section title="Data Collected Beyond Cookies">
                    <p>
                        In addition to cookies, we may collect technical data server-side, including your IP address, referrer URL,
                        and request metadata for security and fraud prevention purposes. This data is not used for advertising.
                        For full details, see our{" "}
                        <Link href="/privacy-policy" className="text-link-blue hover:underline">Privacy Policy</Link>.
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
                        <a href="mailto:contact@startupkaro.in" className="text-link-blue hover:underline">
                            contact@startupkaro.in
                        </a>.
                    </p>
                </Section>
            </div>
            </div>
        </div>
    );
}
