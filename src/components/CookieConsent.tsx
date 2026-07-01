"use client";

import * as React from "react";

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("wb_cookie_consent");
    if (consent === null) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function accept() {
    localStorage.setItem("wb_cookie_consent", "accepted");
    setVisible(false);
    // GA will load on next page load via GoogleAnalytics component check
    window.location.reload();
  }

  function decline() {
    localStorage.setItem("wb_cookie_consent", "declined");
    setVisible(false);
    // Disable GA tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-zinc-800 bg-[#141418] p-4 shadow-2xl sm:left-auto sm:right-6 sm:max-w-sm">
      <p className="text-sm text-zinc-300">
        We use essential cookies for site functionality and optional analytics
        cookies (Google Analytics) to improve your experience.{" "}
        <a
          href="/privacy"
          className="text-[#6d5efc] underline underline-offset-2 hover:text-[#8b7efc]"
        >
          Privacy Policy
        </a>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-lg bg-[#6d5efc] px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded-lg border border-zinc-700 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
