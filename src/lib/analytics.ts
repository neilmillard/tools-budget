export const ENTRY_SOURCES = [
  "budget-planner",
  "blog-50-30-20",
  "blog-zero-based",
  "challenge",
  "worksheet",
  "instagram",
  "newsletter",
] as const;

export type EntrySource = (typeof ENTRY_SOURCES)[number];
export type Entry = EntrySource | "direct";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function getEntrySourceFromSearch(search: string): Entry {
  const from = new URLSearchParams(search).get("from");
  return (ENTRY_SOURCES as readonly string[]).includes(from ?? "") ? (from as EntrySource) : "direct";
}

// No PII in event params — only the allowlisted entry source.
export function trackEvent(name: string, params: Record<string, string>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function trackGuideLinkClick(href: string): void {
  const queryIndex = href.indexOf("?");
  const search = queryIndex >= 0 ? href.slice(queryIndex) : "";
  trackEvent("guide_link_click", { source: getEntrySourceFromSearch(search) });
}

const GUIDE_PRICE_GBP = 7;
const LIVE_SESSION = /^cs_live_[A-Za-z0-9]+$/;

// gtag.js reads its queue as `arguments` objects, so a plain array push would be ignored.
function queueGtag(...args: unknown[]): void {
  void args;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer as unknown[]).push(arguments);
}

/**
 * GA4 `purchase` for the £7 guide, sent from /thank-you after Stripe Checkout.
 * Keyed on the Stripe session id (GA4 dedupes on transaction_id) and fired at most
 * once per browser session. Test-mode sessions are ignored.
 */
export function trackGuidePurchase(sessionId: string | null): boolean {
  if (typeof window === "undefined" || !sessionId || !LIVE_SESSION.test(sessionId)) return false;
  const key = `hm_purchase_${sessionId}`;
  if (window.sessionStorage.getItem(key)) return false;
  window.sessionStorage.setItem(key, "1");

  const send = typeof window.gtag === "function" ? window.gtag : queueGtag;
  send("event", "purchase", {
    transaction_id: sessionId,
    value: GUIDE_PRICE_GBP,
    currency: "GBP",
    items: [
      {
        item_id: "give-every-pound-a-job",
        item_name: "Give Every Pound a Job guide",
        price: GUIDE_PRICE_GBP,
        quantity: 1,
      },
    ],
  });
  return true;
}
