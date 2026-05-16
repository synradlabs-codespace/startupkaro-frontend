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
          heading: "Business",
          href: "/services?category=Business",
          items: [
            {
              label: "Company Incorporation",
              description: "Private Limited company in 10 days",
              href: "/services/company-incorporation",
            },
            {
              label: "ESI & PF Registration",
              description: "Employee welfare compliance made easy",
              href: "/services/esi-pf-registration",
            },
            {
              label: "ROC Annual Filing",
              description: "Keep your company MCA-compliant",
              href: "/services/roc-annual-filing",
            },
            {
              label: "Startup India Recognition",
              description: "Unlock DPIIT benefits & tax exemptions",
              href: "/services/startup-india-recognition",
            },
          ],
        },
        {
          heading: "Tax",
          href: "/services?category=Tax",
          items: [
            {
              label: "GST Registration",
              description: "Get your GSTIN in 7 working days",
              href: "/services/gst-registration",
            },
            {
              label: "Income Tax Filing",
              description: "ITR filing for individuals & firms",
              href: "/services/income-tax-filing",
            },
          ],
        },
        {
          heading: "License",
          href: "/services?category=License",
          items: [
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
            {
              label: "Udyam Registration",
              description: "MSME certificate & government schemes",
              href: "/services/udyam-registration",
            },
            {
              label: "Shop & Establishment Registration",
              description: "State licence for any commercial premises",
              href: "/services/shop-establishment-registration",
            },
          ],
        },
        {
          heading: "Legal",
          href: "/services?category=Legal",
          accent: true,
          items: [
            {
              label: "Trademark Filing",
              description: "Protect your brand legally",
              href: "/services/trademark-filing",
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
