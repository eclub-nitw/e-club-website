import type { Metadata, Viewport } from "next";
import { bricolage, instrument, instrumentSerif, jetbrains } from "@/lib/fonts";
import { site } from "@/data/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/ui/Footer";
import { FloatingPill } from "@/components/ui/FloatingPill";
import { Nav } from "@/components/ui/Nav";
import { Vine } from "@/components/ui/Vine";
import { spotlightIsVisible } from "@/lib/spotlight";
import "./globals.css";

export const revalidate = 3600; // the nav button and floating pill start from the server clock, then follow the browser clock; this keeps cached HTML from staying stale for long

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: `${site.name}, the Entrepreneurship Club of NIT Warangal. ${site.quote.line}`,
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
        <Nav spotlightVisible={spotlightIsVisible()} />
        <Vine />
        <main id="main">{children}</main>
        <FloatingPill spotlightVisible={spotlightIsVisible()} />
        <Footer />
      </body>
    </html>
  );
}
