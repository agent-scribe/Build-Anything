/**
 * analytics.ts — Google Analytics 4 helpers.
 * Buyer: set NEXT_PUBLIC_GA_ID in .env to enable tracking.
 * No cost — GA4 is free for standard use.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Send a custom GA4 event. */
export function trackEvent(action: string, params?: Record<string, string | number>) {
  if (!GA_ID || typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", action, params);
  }
}

/** Convenience wrappers for key product events. */
export const analytics = {
  generate: (prompt: string) =>
    trackEvent("generate_site", { prompt_length: prompt.length }),
  templatePick: (templateId: string) =>
    trackEvent("template_pick", { template_id: templateId }),
  exportSite: (format: string) =>
    trackEvent("export_site", { format }),
  signUp: () => trackEvent("sign_up"),
  startCheckout: (plan: string) =>
    trackEvent("begin_checkout", { plan }),
  collabConnect: () => trackEvent("collab_connect"),
};
