// features/marketing/components/MarketingFooter.tsx

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { NAV_LINKS } from "@/components/directional-hover-header/header/nav-data";
import { UnderlineAnimation } from "@/components/fancy/text";

const servicesMenu = NAV_LINKS.find((link) => link.label === "Services")?.menu;

const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "All Services" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/login", label: "Login" },
    { href: "/employee/login", label: "Employee Login" },
];

const legalLinks = [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookies-policy", label: "Cookies Policy" },
    { href: "/refund-policy", label: "Refund Policy" },
];

export function MarketingFooter() {
    return (
        <footer className="bg-canvas text-ink border-t border-hairline">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="grid gap-10 border-b border-hairline pb-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.7fr)] lg:gap-16">
                    <div className="space-y-5">
                        <Link href="/" className="inline-flex">
                            <Image
                                src="/startupkaro-logo.svg"
                                alt="StartupKaro"
                                width={160}
                                height={30}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-charcoal">
                            End-to-end compliance and legal services for Indian startups, handled by expert CAs and CSs.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-graphite transition-colors hover:border-primary-brand hover:text-primary-brand"
                            >
                                <FaTwitter className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="#"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-graphite transition-colors hover:border-primary-brand hover:text-primary-brand"
                            >
                                <FaLinkedinIn className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-graphite transition-colors hover:border-primary-brand hover:text-primary-brand"
                            >
                                <FaInstagram className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.7px] text-primary-brand">
                                    Services
                                </p>
                                <h2 className="font-display text-2xl font-medium leading-none text-ink sm:text-3xl">
                                    Business support by category
                                </h2>
                            </div>
                            <Link
                                href="/services"
                                className="group text-sm font-medium text-primary-brand transition-colors hover:text-primary-deep"
                            >
                                <UnderlineAnimation lineClassName="bg-primary-brand">View all services</UnderlineAnimation>
                            </Link>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                            {servicesMenu?.columns.map((column) => (
                                <div key={column.heading}>
                                    {column.href ? (
                                        <Link
                                            href={column.href}
                                            className="group mb-4 block text-xs font-semibold uppercase tracking-[0.7px] text-ink transition-colors hover:text-primary-brand"
                                        >
                                            <UnderlineAnimation lineClassName="bg-primary-brand">
                                                {column.heading}
                                            </UnderlineAnimation>
                                        </Link>
                                    ) : (
                                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-ink">
                                            {column.heading}
                                        </h3>
                                    )}
                                    <ul className="space-y-3">
                                        {column.items.map((item) => (
                                            <li key={item.href ?? item.label}>
                                                {item.href ? (
                                                    <Link
                                                        href={item.href}
                                                        className="group block text-sm leading-snug text-charcoal transition-colors hover:text-ink"
                                                    >
                                                        <UnderlineAnimation lineClassName="bg-primary-brand">
                                                            {item.label}
                                                        </UnderlineAnimation>
                                                    </Link>
                                                ) : (
                                                    <span className="block text-sm leading-snug text-charcoal">
                                                        {item.label}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-10 border-b border-hairline py-10 md:grid-cols-3">
                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-ink">Company</h3>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group text-sm text-charcoal transition-colors hover:text-ink">
                                        <UnderlineAnimation lineClassName="bg-primary-brand">{link.label}</UnderlineAnimation>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-ink">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-charcoal">
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-brand" />
                                hello@startupkaro.in
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-charcoal">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-brand" />
                                +91 789 00000 88
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-charcoal">
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-brand" />
                                +91 737 00000 88
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-charcoal">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-brand" />
                                Mohali, Punjab, India
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.7px] text-ink">Legal</h3>
                        <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group text-sm text-charcoal transition-colors hover:text-ink"
                                >
                                    <UnderlineAnimation lineClassName="bg-primary-brand">{link.label}</UnderlineAnimation>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-3 pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-graphite">
                        &copy; {new Date().getFullYear()} StartupKaro. All rights reserved.
                    </p>
                    <p className="text-xs text-graphite">
                        Fixed services at fixed costs, delivered by qualified professionals.
                    </p>
                </div>
            </div>
        </footer>
    );
}
