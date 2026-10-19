import { describe, expect, test, beforeEach } from "@jest/globals";
import { getEntrySourceFromSearch, trackEvent, trackGuideLinkClick, trackGuidePurchase } from "@/lib/analytics";

describe("getEntrySourceFromSearch", () => {
  test("returns the source when it is on the allowlist", () => {
    expect(getEntrySourceFromSearch("?from=budget-planner")).toBe("budget-planner");
    expect(getEntrySourceFromSearch("?from=blog-50-30-20")).toBe("blog-50-30-20");
    expect(getEntrySourceFromSearch("?from=blog-zero-based")).toBe("blog-zero-based");
    expect(getEntrySourceFromSearch("?from=challenge")).toBe("challenge");
    expect(getEntrySourceFromSearch("?from=worksheet")).toBe("worksheet");
    expect(getEntrySourceFromSearch("?from=instagram")).toBe("instagram");
    expect(getEntrySourceFromSearch("?from=newsletter")).toBe("newsletter");
  });

  test("falls back to direct for an unknown or missing source", () => {
    expect(getEntrySourceFromSearch("?from=some-random-value")).toBe("direct");
    expect(getEntrySourceFromSearch("")).toBe("direct");
    expect(getEntrySourceFromSearch("?other=1")).toBe("direct");
  });
});

describe("trackEvent", () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    window.gtag = undefined;
  });

  afterAll(() => {
    window.gtag = originalGtag;
  });

  test("does nothing when window.gtag is not available", () => {
    expect(() => trackEvent("guide_link_click", { source: "direct" })).not.toThrow();
  });

  test("calls window.gtag with the event name and params when available", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    trackEvent("guide_link_click", { source: "budget-planner" });
    expect(gtag).toHaveBeenCalledWith("event", "guide_link_click", { source: "budget-planner" });
  });
});

describe("trackGuideLinkClick", () => {
  beforeEach(() => {
    window.gtag = jest.fn();
  });

  test("resolves the source from the link's own query string", () => {
    trackGuideLinkClick("/guide/give-every-pound-a-job/?from=blog-50-30-20");
    expect(window.gtag).toHaveBeenCalledWith("event", "guide_link_click", { source: "blog-50-30-20" });
  });

  test("defaults to direct when the href has no recognised from param", () => {
    trackGuideLinkClick("/guide/give-every-pound-a-job/");
    expect(window.gtag).toHaveBeenCalledWith("event", "guide_link_click", { source: "direct" });
  });
});

describe("trackGuidePurchase", () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    window.gtag = undefined;
    window.dataLayer = [];
    window.sessionStorage.clear();
  });

  afterAll(() => {
    window.gtag = originalGtag;
  });

  test("sends a GA4 purchase for a live Stripe session, keyed on the session id", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    expect(trackGuidePurchase("cs_live_abc123")).toBe(true);
    expect(gtag).toHaveBeenCalledWith("event", "purchase", {
      transaction_id: "cs_live_abc123",
      value: 7,
      currency: "GBP",
      items: [{ item_id: "give-every-pound-a-job", item_name: "Give Every Pound a Job guide", price: 7, quantity: 1 }],
    });
  });

  test("fires only once per session, so a refresh is not a second sale", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    trackGuidePurchase("cs_live_abc123");
    expect(trackGuidePurchase("cs_live_abc123")).toBe(false);
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  test("ignores Stripe test-mode and malformed session ids", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    expect(trackGuidePurchase("cs_test_abc123")).toBe(false);
    expect(trackGuidePurchase("not-a-session")).toBe(false);
    expect(trackGuidePurchase(null)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  test("queues the event on dataLayer in gtag's arguments format when gtag.js has not loaded yet", () => {
    expect(trackGuidePurchase("cs_live_xyz")).toBe(true);
    const queued = window.dataLayer?.[0] as unknown as IArguments;
    expect(Object.prototype.toString.call(queued)).toBe("[object Arguments]");
    expect(Array.from(queued).slice(0, 2)).toEqual(["event", "purchase"]);
  });
});
