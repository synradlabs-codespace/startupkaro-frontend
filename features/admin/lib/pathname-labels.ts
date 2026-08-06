// Maps raw URL paths to plain-language page names for the admin analytics
// screen. The client doesn't know what a "route" or "pathname" is — this
// keeps that vocabulary out of the UI entirely.

const KNOWN_PAGES: Record<string, string> = {
    "/": "Home",
    "/about": "About Us",
    "/contact": "Contact",
    "/careers": "Careers",
    "/article": "Articles",
    "/bundles": "Bundles",
    "/services": "Services",
    "/tech-services": "Tech Services",
    "/franchise": "Franchise",
    "/privacy-policy": "Privacy Policy",
    "/terms-of-service": "Terms of Service",
    "/refund-policy": "Refund Policy",
    "/cookies-policy": "Cookies Policy",
};

const KNOWN_SECTIONS: Record<string, string> = {
    services: "Services",
    bundles: "Bundles",
    article: "Articles",
    careers: "Careers",
};

const ACRONYMS = new Set(["gst", "roc", "dpiit", "fssai", "msme", "pan", "tan", "cfo", "llp", "cs", "ca"]);

function prettifySegment(segment: string) {
    return decodeURIComponent(segment)
        .replace(/[-_]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => (ACRONYMS.has(word.toLowerCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(" ");
}

export function pathnameToLabel(pathname: string): string {
    const clean = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";
    if (KNOWN_PAGES[clean]) return KNOWN_PAGES[clean];

    const segments = clean.split("/").filter(Boolean);
    if (segments.length === 0) return "Home";

    const last = prettifySegment(segments[segments.length - 1]);
    if (segments.length === 1) return last;

    const section = KNOWN_SECTIONS[segments[0]] ?? prettifySegment(segments[0]);
    return `${section} – ${last}`;
}
