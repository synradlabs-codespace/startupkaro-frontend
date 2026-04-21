// features/marketing/components/MarketingFooter.tsx

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";


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
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Login" },
];

export function MarketingFooter() {
    return (
        <footer className="border-t border-gray-100 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
                        <p className="text-sm text-gray-500 leading-relaxed">
                            End-to-end compliance and legal services for Indian startups, handled by expert CAs and CSs.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FF9933] hover:border-[#FF9933]/30 transition-colors"
                            >
                                <FaTwitter className="h-3.5 w-3.5" />
                            </a>

                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#000080] hover:border-[#000080]/30 transition-colors"
                            >
                                <FaLinkedinIn className="h-3.5 w-3.5" />
                            </a>

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#6BAE3A] hover:border-[#6BAE3A]/30 transition-colors"
                            >
                                <FaInstagram className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Services column */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Services</h3>
                        <ul className="space-y-2.5">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company column */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-gray-500">
                                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-[#FF9933]" />
                                hello@startupkaro.in
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-gray-500">
                                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-[#000080]" />
                                +91 789 00000 88
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-gray-500">
                                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-[#000080]" />
                                +91 737 00000 88
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[#6BAE3A]" />
                                Mohali, Punjab, India
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} StartupKaro. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/privacy-policy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</Link>
                        <Link href="/cookies-policy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Cookies Policy</Link>
                        <Link href="/refund-policy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
