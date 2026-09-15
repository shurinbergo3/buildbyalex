"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GA_ID } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";

const adConsent = (granted: boolean) => {
  const value = granted ? "granted" : "denied";
  return { ad_storage: value, ad_user_data: value, ad_personalization: value };
};

/**
 * GA4 with Consent Mode v2. Nothing loads until NEXT_PUBLIC_GA_ID is set and
 * the visitor has allowed analytics in the cookie banner. Ad signals follow
 * the separate "marketing" choice and can change without a reload.
 */
export function GoogleAnalytics() {
  const consent = useConsent();
  const allowed = Boolean(GA_ID) && process.env.NODE_ENV === "production" && consent?.analytics === true;
  const marketing = consent?.marketing === true;

  useEffect(() => {
    if (allowed) window.gtag?.("consent", "update", adConsent(marketing));
  }, [allowed, marketing]);

  if (!allowed) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('consent', 'update', ${JSON.stringify({ analytics_storage: "granted", ...adConsent(marketing) })});
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
