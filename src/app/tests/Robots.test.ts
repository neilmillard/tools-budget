import { describe, expect, test } from "@jest/globals";
import { existsSync } from "fs";
import path from "path";
import robots from "@/app/robots";

const rules = () => {
  const r = robots().rules;
  return Array.isArray(r) ? r : [r];
};

describe("robots.txt", () => {
  test("every rule group keeps the checkout flow and API out of the index", () => {
    for (const rule of rules()) {
      expect(rule.disallow).toEqual(
        expect.arrayContaining(["/api/", "/thank-you/", "/checkout-cancelled/"]),
      );
    }
  });

  test("no rule group references the retired /test-checkout/ page", () => {
    for (const rule of rules()) {
      expect(rule.disallow).not.toContain("/test-checkout/");
    }
  });
});

describe("retired /test-checkout/ page", () => {
  test("the page is no longer part of the app", () => {
    expect(
      existsSync(path.join(process.cwd(), "src/app/test-checkout/page.tsx")),
    ).toBe(false);
  });
});
