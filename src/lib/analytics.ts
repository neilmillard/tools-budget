export const ENTRY_SOURCES = [
  "budget-planner",
  "blog-50-30-20",
  "blog-zero-based",
  "challenge",
  "worksheet",
  "instagram",
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
