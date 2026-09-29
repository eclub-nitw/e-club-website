import type { Metadata } from "next";
import { bricolage, instrument, jetbrains } from "@/lib/fonts";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Entrepreneurship Club, NIT Warangal`, template: `%s | ${site.name}` },
  description: "The Entrepreneurship Club of NIT Warangal: events, competitions, speaker sessions and a community for student founders.",
  alternates: { canonical: "/" },
  openGraph: { siteName: site.name, locale: "en_IN", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  logo: `${site.url}/images/brand/eclub-logo.png`,
  email: site.email,
  sameAs: [site.instagram, site.linkedin, site.youtube].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="club" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="grain">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <SmoothScroll />
        {/* WAHID: <Nav /> here */}
        {children}
        {/* WAHID: <Footer /> here */}
      </body>
    </html>
  );
}
