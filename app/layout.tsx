import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";

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
  title: "StartupKaro",
  description: "Startup services platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${gilroy.variable}`}>
      <body className="antialiased font-sans">
        <QueryProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}