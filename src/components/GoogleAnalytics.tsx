"use client";

import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

/**
 * GA4. Renders nothing until NEXT_PUBLIC_GA_ID is set, so the site ships fine
 * without it and starts collecting the moment the variable lands in the build.
 * Skipped in development to keep the property clean.
 *
 * Metrica stays alongside it — the two answer different questions here:
 * Metrica has the session recordings, GA4 is what Search Console and Ads link to.
 */
export function GoogleAnalytics() {
  if (!GA_ID || process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
