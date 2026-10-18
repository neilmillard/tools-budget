import { describe, expect, test, beforeEach } from "@jest/globals";
import { getEntrySourceFromSearch, trackEvent, trackGuideLinkClick } from "@/lib/analytics";

describe("getEntrySourceFromSearch", () => {
  test("returns the source when it is on the allowlist", () => {
    expect(getEntrySourceFromSearch("?from=budget-planner")).toBe("budget-planner");
    expect(getEntrySourceFromSearch("?from=blog-50-30-20")).toBe("blog-50-30-20");
    expect(getEntrySourceFromSearch("?from=blog-zero-based")).toBe("blog-zero-based");
    expect(getEntrySourceFromSearch("?from=challenge")).toBe("challenge");
    expect(getEntrySourceFromSearch("?from=worksheet")).toBe("worksheet");
    expect(getEntrySourceFromSearch("?from=instagram")).toBe("instagram");
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
