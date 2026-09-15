"use client";

import Script from "next/script";
import { YM_ID } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";

/**
 * Yandex.Metrika counter. Webvisor records sessions, so it waits for the
 * analytics consent like GA does. Skipped in development to keep stats clean.
 */
export function YandexMetrika() {
  const consent = useConsent();
  if (process.env.NODE_ENV !== "production" || consent?.analytics !== true) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');

        ym(${YM_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
      `}
    </Script>
  );
}
