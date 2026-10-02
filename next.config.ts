import type { NextConfig } from "next";

// Security headers on every route. Do not remove one without writing down why in the PR.
// The CSP lists only the origins this site really uses. If you add an external script, embed or API, add its exact origin here:
// never widen to a wildcard or 'unsafe-eval' to make an error go away.
const csp = [
  "default-src 'self'",
  // Next injects small inline bootstrap scripts, so 'unsafe-inline' stays until nonces are wired in; no eval, no remote scripts.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // YouTube's CDN serves the video facade thumbnail; blob: is for WebGL texture decoding.
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },                       // clickjacking (older browsers; CSP frame-ancestors covers the rest)
  { key: "X-Content-Type-Options", value: "nosniff" },              // no MIME sniffing
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=86400" }, // one day while the final domain is being set up; raise per docs/DOMAIN-CUTOVER.md once it is stable on HTTPS
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },      // isolates our window from pages that open us
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

// Art, posters and models are replaced by renaming, never in place, so a month of caching is safe and removes repeat-visit transfer.
const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/images/:path*", headers: longCache },
      { source: "/models/:path*", headers: longCache },
    ];
  },
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
