import type { Metadata, Viewport } from "next";
import { bricolage, instrument, instrumentSerif, jetbrains } from "@/lib/fonts";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/ui/Footer";
import { FloatingPill } from "@/components/ui/FloatingPill";
import { Nav } from "@/components/ui/Nav";
import { Vine } from "@/components/ui/Vine";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: "E-Club NIT Warangal: competitions, pitch sessions and a community for student founders. Flagship: Venture Vortex 2026.",
  alternates: { canonical: "/" },
  openGraph: { siteName: site.name, locale: "en_IN", type: "website" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0b2226", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="club" className={`${bricolage.variable} ${instrument.variable} ${instrumentSerif.variable} ${jetbrains.variable}`}>
      <body className="grain antialiased">
        <SmoothScroll />
        <Nav />
        <Vine />
        <main id="main">{children}</main>
        <FloatingPill />
        <Footer />
      </body>
    </html>
  );
}
