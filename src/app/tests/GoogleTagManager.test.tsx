import "@testing-library/jest-dom";
import { describe, test, expect } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import { GoogleTagManager } from "@/components/GoogleTagManager";

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
