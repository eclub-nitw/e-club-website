import type { Metadata, Viewport } from "next";
import { bricolage, instrument, jetbrains } from "@/lib/fonts";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Footer } from "@/components/ui/Footer";
import { Nav } from "@/components/ui/Nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Entrepreneurship Club, NIT Warangal`, template: `%s | ${site.name}` },
  description: "The Entrepreneurship Club of NIT Warangal: events, competitions, speaker sessions and a community for student founders.",
  alternates: { canonical: "/" },
  openGraph: { siteName: site.name, locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0b2226", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="club" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="grain antialiased">
        <SmoothScroll />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
