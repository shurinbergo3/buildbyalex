import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Directives that don't need a per-request nonce, so they survive the fully
// static build. `script-src` is deliberately absent: the site is prerendered,
// and Next inlines the RSC payload as inline <script> — locking that down would
// need a nonce, which means turning every page dynamic. Revisit if the app ever
// starts rendering user-submitted HTML.
const CSP = [
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Don't advertise the framework — it only helps someone pick an exploit.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  // Long-lived caching for static media in /public (hero video, case images,
  // fonts). These have stable filenames and rarely change, so a 30-day cache
  // makes repeat visits near-instant — PageSpeed flagged the default short TTL.
  // To bust the cache when a file does change, rename it (or append ?v=N).
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      {
        source: "/:path*\\.(mp4|webm|webp|avif|jpg|jpeg|png|gif|svg|woff|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
