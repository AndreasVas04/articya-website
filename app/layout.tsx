import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { meta } from "@/content/home";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({ title: meta.title, description: meta.description, path: "/" }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the home page's inline script adds a
    // pre-hydration flag class to <html> before React attaches.
    <html
      lang="en"
      className={`${instrumentSans.variable} ${bricolage.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
