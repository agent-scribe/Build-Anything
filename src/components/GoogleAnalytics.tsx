"use client";

import Script from "next/script";
import { GA_ID } from "@/lib/analytics";
import { useEffect, useState } from "react";

/**
 * Renders GA4 script tags. Only loads when:
 * 1. NEXT_PUBLIC_GA_ID environment variable is set
 * 2. User has accepted cookies via the consent banner
 *
 * GDPR/CCPA compliant — no tracking scripts are loaded until consent is given.
 */
export function GoogleAnalytics() {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("wb_cookie_consent");
    setConsentGiven(consent === "accepted");
  }, []);

  if (!GA_ID || !consentGiven) return null;

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
          gtag('js', new Date());
          gtag('consent', 'default', { analytics_storage: 'granted' });
          gtag('config', '${GA_ID}', { send_page_view: true, anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
