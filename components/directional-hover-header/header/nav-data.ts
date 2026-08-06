export type NavItem = {
  label: string;
  description?: string;
  href?: string;
};

export type NavColumn = {
  heading: string;
  href?: string;
  items: NavItem[];
  accent?: boolean;
};

export type NavMenu = {
  id: string;
  columns: NavColumn[];
};

export type NavLink = {
  label: string;
  href?: string;
  menu?: NavMenu;
};

export const NAV_LINKS: NavLink[] = [
  {
    label: "Services",
    menu: {
      id: "services",
      columns: [
        {
          heading: "Bundles",
          href: "/bundles",
          items: [
            { label: "Private Limited Company Bundle", description: "Company setup with GST, MSME, PAN/TAN, and DPIIT", href: "/bundles/private-limited-company-bundle" },
            { label: "LLP Bundle", description: "LLP setup with GST, MSME, PAN, and Startup India", href: "/bundles/llp-bundle" },
            { label: "Partnership Firm Bundle", description: "Partnership setup with core registrations", href: "/bundles/partnership-firm-bundle" },
            { label: "Proprietorship Bundle", description: "Starter pack for solo business owners", href: "/bundles/proprietorship-bundle" },
          ],
        },
        {
          heading: "Start",
          href: "/services?category=Start",
          items: [
            { label: "Private Limited Company", description: "Incorporation and launch registrations", href: "/services/private-limited-company" },
            { label: "GST Registration", description: "Get GST-ready for sales and invoices", href: "/services/gst-registration" },
            { label: "FSSAI Registration", description: "Food business licence support", href: "/services/fssai-registration-basic" },
            { label: "Startup India DPIIT", description: "Recognition for eligible startups", href: "/services/startup-india-dpiit" },
          ],
        },
        {
          heading: "Manage",
          href: "/services?category=Manage",
          items: [
            { label: "Bookkeeping", description: "Monthly books and accounting support", href: "/services/bookkeeping" },
            { label: "GST Compliances", description: "Monthly GST filing and compliance", href: "/services/gst-compliances" },
            { label: "ROC Compliances", description: "Company and LLP compliance support", href: "/services/pvt-ltd-roc-compliances" },
            { label: "Virtual CFO Services", description: "Finance leadership for growing teams", href: "/services/virtual-cfo-services" },
          ],
        },
        {
          heading: "Protect",
          href: "/services?category=Protect",
          accent: true,
          items: [
            { label: "Trademark Registration", description: "Protect your brand identity", href: "/services/trademark-registration" },
            { label: "Renew Your Trademark", description: "Keep trademark protection active", href: "/services/renew-your-trademark" },
            { label: "Contracts & Agreements", description: "Legal documents for business needs", href: "/services/contracts-and-agreements" },
            { label: "Investor Agreements", description: "Founder and investor documentation", href: "/services/investor-agreements" },
          ],
        },
        {
          heading: "Tech",
          href: "/tech-services",
          items: [
            { label: "Website and Apps", description: "Responsive websites and mobile-first product flows", href: "/tech-services" },
            { label: "UI/UX Design", description: "Screens, flows, and founder-ready interfaces", href: "/tech-services" },
            { label: "Automation", description: "Reduce manual work with practical workflows", href: "/tech-services" },
            { label: "Dashboards", description: "Admin panels and operating dashboards", href: "/tech-services" },
          ],
        },
      ],
    },
  },
  {
    label: "Tech",
    href: "/tech-services",
  },
  {
    label: "Franchise",
    href: "/franchise",
  },
  {
    label: "Company",
    menu: {
      id: "company",
      columns: [
        {
          heading: "About Us",
          items: [
            { label: "About StartupKaro", description: "Our story and mission", href: "/about" },
            { label: "Careers", description: "Join our growing team", href: "/careers" },
            { label: "Articles", description: "Insights and guides for founders", href: "/article" },
            { label: "Contact", description: "Talk to our team", href: "/contact" },
          ],
        },
        {
          heading: "Legal",
          accent: true,
          items: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Refund Policy", href: "/refund-policy" },
            { label: "Cookies Policy", href: "/cookies-policy" },
          ],
        },
      ],
    },
  },
];
