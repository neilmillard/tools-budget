import "@testing-library/jest-dom";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import CookieBanner from "@/components/CookieConsentBanner";

beforeEach(() => {
  localStorage.clear();
});

describe("CookieBanner", () => {
  test.each([
    ["Accept", "granted"],
    ["Decline", "denied"],
  ])("%s stores the choice and announces it so gtag consent is updated", (label, stored) => {
    const listener = jest.fn();
    window.addEventListener("consentUpdated", listener);
    render(<CookieBanner />);

    fireEvent.click(screen.getByRole("button", { name: label }));

    expect(localStorage.getItem("tac_consent")).toBe(stored);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: label })).not.toBeInTheDocument();
    window.removeEventListener("consentUpdated", listener);
  });
});
