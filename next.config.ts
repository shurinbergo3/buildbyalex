import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
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
