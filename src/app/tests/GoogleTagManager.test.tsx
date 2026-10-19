import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { act, render, waitFor } from "@testing-library/react";
import { GoogleTagManager, gtagInitScript } from "@/components/GoogleTagManager";

const SIGNALS = ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"];

function entries(): unknown[][] {
  return ((window.dataLayer ?? []) as unknown[]).map((entry) => Array.from(entry as IArguments));
}

function runInitScript(gtmId = "G-TEST123") {
  new Function(gtagInitScript(gtmId))();
}

beforeEach(() => {
  delete window.dataLayer;
  window.gtag = undefined;
  localStorage.clear();
  jest.restoreAllMocks();
});

describe("GoogleTagManager", () => {
  test("loads the gtag.js script with the async attribute, matching Google's supported snippet", async () => {
    render(<GoogleTagManager gtmId="G-TEST123" />);

    await waitFor(() => {
      const script = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.googletagmanager.com/gtag/js?id=G-TEST123"]'
      );
      expect(script).not.toBeNull();
      expect(script?.async).toBe(true);
    });
  });
});

describe("gtagInitScript", () => {
  test("pushes every entry as an arguments object, which is the only shape gtag.js reads", () => {
    runInitScript();
    const queued = (window.dataLayer ?? []) as unknown[];
    expect(queued.length).toBeGreaterThan(0);
    queued.forEach((entry) => {
      expect(Object.prototype.toString.call(entry)).toBe("[object Arguments]");
    });
  });

  test("defaults all consent signals to denied before config", () => {
    runInitScript();
    const list = entries();
    const defaultIndex = list.findIndex((e) => e[0] === "consent" && e[1] === "default");
    const configIndex = list.findIndex((e) => e[0] === "config");

    expect(defaultIndex).toBeGreaterThanOrEqual(0);
    expect(configIndex).toBeGreaterThan(defaultIndex);
    const params = list[defaultIndex][2] as Record<string, unknown>;
    SIGNALS.forEach((signal) => expect(params[signal]).toBe("denied"));
    expect(params.wait_for_update).toEqual(expect.any(Number));
    expect(list[configIndex][1]).toBe("G-TEST123");
  });

  test("grants consent before config when the visitor accepted on an earlier visit", () => {
    localStorage.setItem("tac_consent", "granted");
    runInitScript();
    const list = entries();
    const updateIndex = list.findIndex((e) => e[0] === "consent" && e[1] === "update");
    const configIndex = list.findIndex((e) => e[0] === "config");

    expect(updateIndex).toBeGreaterThanOrEqual(0);
    expect(configIndex).toBeGreaterThan(updateIndex);
    const params = list[updateIndex][2] as Record<string, unknown>;
    SIGNALS.forEach((signal) => expect(params[signal]).toBe("granted"));
  });

  test("sends no update when there is no stored choice or it was declined", () => {
    runInitScript();
    localStorage.setItem("tac_consent", "denied");
    runInitScript();
    expect(entries().some((e) => e[0] === "consent" && e[1] === "update")).toBe(false);
  });
});

describe("consentUpdated", () => {
  function lastUpdate(): Record<string, unknown> | undefined {
    const updates = entries().filter((e) => e[0] === "consent" && e[1] === "update");
    return updates.at(-1)?.[2] as Record<string, unknown> | undefined;
  }

  test.each(["granted", "denied"])("re-applies a %s choice as an arguments-shaped update", (choice) => {
    render(<GoogleTagManager gtmId="G-TEST123" />);
    localStorage.setItem("tac_consent", choice);
    act(() => {
      window.dispatchEvent(new Event("consentUpdated"));
    });

    const queued = (window.dataLayer ?? []) as unknown[];
    expect(Object.prototype.toString.call(queued.at(-1))).toBe("[object Arguments]");
    const params = lastUpdate();
    SIGNALS.forEach((signal) => expect(params?.[signal]).toBe(choice));
  });

  test("uses window.gtag when gtag.js is already on the page", () => {
    const gtag = jest.fn();
    window.gtag = gtag;
    render(<GoogleTagManager gtmId="G-TEST123" />);
    localStorage.setItem("tac_consent", "granted");
    act(() => {
      window.dispatchEvent(new Event("consentUpdated"));
    });

    expect(gtag).toHaveBeenCalledWith("consent", "update", expect.objectContaining({ analytics_storage: "granted" }));
  });

  test("does not push anything on mount or log to the console", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});
    localStorage.setItem("tac_consent", "granted");
    render(<GoogleTagManager gtmId="G-TEST123" />);

    expect(lastUpdate()).toBeUndefined();
    expect(log).not.toHaveBeenCalled();
  });
});
