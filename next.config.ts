import type { NextConfig } from "next";

// Security headers applied to every route. This is what "no security loopholes" means in
// practice for a static Next.js site: no server to breach, but the browser still needs telling
// what it's allowed to do. Do not remove any of these without writing down why in the PR.
const securityHeaders = [
  // Stop the site from being framed by another origin (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop the browser guessing content types (MIME sniffing).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin, not the full URL with query params, to other sites via Referer.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser APIs this site has no reason to use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Force HTTPS for a year, including subdomains, once first served over HTTPS (Vercel default anyway).
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Content Security Policy: only allow scripts/styles/fonts/images from ourselves and the
  // specific third parties this site actually uses (self-hosted fonts via next/font need no
  // external font-src; YouTube embeds and Vercel Analytics are the only external origins).
  // If you add a new external script or embed, add its origin here — do not switch to 'unsafe-inline'
  // or a wildcard to make an error go away; find the exact origin instead.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "frame-src https://www.youtube-nocookie.com",
      "connect-src 'self' https://vitals.vercel-insights.com",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
