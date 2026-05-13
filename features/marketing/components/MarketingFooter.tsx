// features/marketing/components/MarketingFooter.tsx

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { UnderlineAnimation } from "@/components/fancy/text";

const serviceLinks = [
    { href: "/services/gst-registration", label: "GST Registration" },
    { href: "/services/company-incorporation", label: "Company Incorporation" },
    { href: "/services/trademark-filing", label: "Trademark Filing" },
    { href: "/services/income-tax-filing", label: "Income Tax Filing" },
    { href: "/services/fssai-license", label: "FSSAI License" },
    { href: "/services/import-export-code", label: "Import Export Code" },
];

const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "All Services" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Login" },
];

export function MarketingFooter() {
    return (
        <footer className="bg-canvas border-t border-hairline">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

                    {/* Brand column */}
                    <div className="md:col-span-1 space-y-4">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/startupkaro-logo.svg"
                                alt="StartupKaro"
                                width={160}
                                height={30}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="text-sm text-steel leading-relaxed">
                            End-to-end compliance and legal services for Indian startups, handled by expert CAs and CSs.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <a href="#" aria-label="Twitter"
                                className="h-8 w-8 rounded-md border border-hairline flex items-center justify-center text-stone hover:text-ink hover:border-hairline-strong transition-colors">
                                <FaTwitter className="h-3.5 w-3.5" />
                            </a>
                            <a href="#" aria-label="LinkedIn"
                                className="h-8 w-8 rounded-md border border-hairline flex items-center justify-center text-stone hover:text-ink hover:border-hairline-strong transition-colors">
                                <FaLinkedinIn className="h-3.5 w-3.5" />
                            </a>
                            <a href="#" aria-label="Instagram"
                                className="h-8 w-8 rounded-md border border-hairline flex items-center justify-center text-stone hover:text-ink hover:border-hairline-strong transition-colors">
                                <FaInstagram className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h3 className="text-xs font-semibold text-ink uppercase tracking-[0.12em] mb-4">Services</h3>
                        <ul className="space-y-2.5">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group text-sm text-steel hover:text-ink transition-colors">
                                        <UnderlineAnimation>{link.label}</UnderlineAnimation>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company column */}
                    <div>
                        <h3 className="text-xs font-semibold text-ink uppercase tracking-[0.12em] mb-4">Company</h3>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group text-sm text-steel hover:text-ink transition-colors">
                                        <UnderlineAnimation>{link.label}</UnderlineAnimation>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h3 className="text-xs font-semibold text-ink uppercase tracking-[0.12em] mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-steel">
                                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-stone" />
                                hello@startupkaro.in
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-steel">
                                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-stone" />
                                +91 789 00000 88
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-steel">
                                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-stone" />
                                +91 737 00000 88
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-steel">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-stone" />
                                Mohali, Punjab, India
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-stone">
                        © {new Date().getFullYear()} StartupKaro. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/privacy-policy" className="group text-xs text-stone hover:text-ink transition-colors">
                            <UnderlineAnimation>Privacy Policy</UnderlineAnimation>
                        </Link>
                        <Link href="/terms-of-service" className="group text-xs text-stone hover:text-ink transition-colors">
                            <UnderlineAnimation>Terms of Service</UnderlineAnimation>
                        </Link>
                        <Link href="/cookies-policy" className="group text-xs text-stone hover:text-ink transition-colors">
                            <UnderlineAnimation>Cookies Policy</UnderlineAnimation>
                        </Link>
                        <Link href="/refund-policy" className="group text-xs text-stone hover:text-ink transition-colors">
                            <UnderlineAnimation>Refund Policy</UnderlineAnimation>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
