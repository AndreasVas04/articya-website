import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RouteWipe } from "@/components/route-wipe";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { meta } from "@/content/home";
import { footer } from "@/content/shared";

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

// The organisation itself, beside the FAQ page's own schema: only what the
// site states - the name, its address, the logo and the two profiles the
// footer links to. `<` is escaped so the JSON can never close its own tag.
const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ArtiCYa",
  url: `${siteUrl}/`,
  logo: `${siteUrl}/images/logo.png`,
  sameAs: footer.social.map((s) => s.href),
}).replace(/</g, "\\u003c");

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <RouteWipe />
      </body>
    </html>
  );
}
