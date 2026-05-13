export type NavItem = {
  label: string;
  description?: string;
  href?: string;
};

export type NavColumn = {
  heading: string;
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
          heading: "Business Setup",
          items: [
            {
              label: "Company Incorporation",
              description: "Private Limited company in 10 days",
              href: "/services/company-incorporation",
            },
            {
              label: "GST Registration",
              description: "Get your GSTIN in 7 working days",
              href: "/services/gst-registration",
            },
          ],
        },
        {
          heading: "Tax & Licenses",
          items: [
            {
              label: "Income Tax Filing",
              description: "ITR filing for individuals & firms",
              href: "/services/income-tax-filing",
            },
            {
              label: "FSSAI License",
              description: "Food safety registration & renewal",
              href: "/services/fssai-license",
            },
            {
              label: "Import Export Code",
              description: "Start trading globally",
              href: "/services/import-export-code",
            },
          ],
        },
        {
          heading: "Legal",
          accent: true,
          items: [
            {
              label: "Trademark Filing",
              description: "Protect your brand legally",
              href: "/services/trademark-filing",
            },
            {
              label: "View all services",
              href: "/services",
            },
          ],
        },
      ],
    },
  },
  {
    label: "Articles",
    href: "/article",
  },
  {
    label: "Company",
    menu: {
      id: "company",
      columns: [
        {
          heading: "About Us",
          items: [
            {
              label: "About StartupKaro",
              description: "Our story and mission",
              href: "/about",
            },
            {
              label: "Careers",
              description: "Join our growing team",
              href: "/careers",
            },
            {
              label: "Contact",
              description: "Talk to our team",
              href: "/contact",
            },
          ],
        },
        {
          heading: "Legal",
          accent: true,
          items: [
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms-of-service" },
            { label: "Refund Policy", href: "/refund-policy" },
          ],
        },
      ],
    },
  },
];
