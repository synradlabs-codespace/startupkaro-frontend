import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, ORG, SITE_LOCALE, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { ogImageUrl } from "@/lib/seo/og";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const gilroy = localFont({
  src: [
    { path: "../fonts/Gilroy-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/Gilroy-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Gilroy-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Gilroy-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/Gilroy-Heavy.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | StartupKaro",
  },
  description: DEFAULT_DESCRIPTION,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    images: [{ url: ogImageUrl(DEFAULT_TITLE), width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: ORG.twitterHandle,
    creator: ORG.twitterHandle,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [ogImageUrl(DEFAULT_TITLE)],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${quicksand.variable} ${gilroy.variable}`}>
      <body className="antialiased font-sans">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
