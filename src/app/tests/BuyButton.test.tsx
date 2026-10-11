import "@testing-library/jest-dom";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import BuyButton from "@/app/components/BuyButton";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/guide/give-every-pound-a-job/");
});

describe("BuyButton", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("renders a buy button", () => {
    render(<BuyButton />);
    expect(screen.getByRole("button", { name: /buy/i })).toBeInTheDocument();
  });

  test("posts to /api/checkout and navigates to the returned url on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" }),
    });
    const navigate = jest.fn();

    render(<BuyButton navigate={navigate} />);
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_abc"));
    expect(mockFetch).toHaveBeenCalledWith("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketingConsent: false, from: "direct" }),
    });
  });

  test("sends marketingConsent true when the marketing checkbox is ticked", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" }),
    });

    render(<BuyButton />);
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    fireEvent.click(screen.getByRole("checkbox", { name: /occasional money tips/i }));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketingConsent: true, from: "direct" }),
    });
  });

  test("reads the allowlisted entry source from the URL and includes it in the checkout request", async () => {
    window.history.pushState({}, "", "/guide/give-every-pound-a-job/?from=budget-planner");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" }),
    });

    render(<BuyButton />);
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketingConsent: false, from: "budget-planner" }),
    });
  });

  test("falls back to direct for an unrecognised from value in the URL", async () => {
    window.history.pushState({}, "", "/guide/give-every-pound-a-job/?from=some-random-campaign");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" }),
    });

    render(<BuyButton />);
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockFetch).toHaveBeenCalledWith("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marketingConsent: false, from: "direct" }),
    });
  });

  test("fires a begin_checkout GA4 event with the entry source on click", async () => {
    window.history.pushState({}, "", "/guide/give-every-pound-a-job/?from=blog-50-30-20");
    window.gtag = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_abc" }),
    });

    render(<BuyButton />);
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    expect(window.gtag).toHaveBeenCalledWith("event", "begin_checkout", { source: "blog-50-30-20" });
  });

  test("does not fire begin_checkout without consent", () => {
    window.gtag = jest.fn();
    render(<BuyButton />);
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));
    expect(window.gtag).not.toHaveBeenCalled();
  });

  test("the marketing consent checkbox is unticked by default and does not block the buy button", () => {
    render(<BuyButton />);
    expect(screen.getByRole("checkbox", { name: /occasional money tips/i })).not.toBeChecked();
  });

  test("shows an error message when checkout cannot be started", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Checkout is not configured yet." }),
    });
    const navigate = jest.fn();

    render(<BuyButton navigate={navigate} />);
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Checkout is not configured yet.");
    expect(navigate).not.toHaveBeenCalled();
  });

  test("buy button is disabled until the consent box is ticked", () => {
    render(<BuyButton />);
    expect(screen.getByRole("button", { name: /buy/i })).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: /lose my right to cancel/i }));
    expect(screen.getByRole("button", { name: /buy/i })).toBeEnabled();
  });

  test("does not call /api/checkout without consent", () => {
    render(<BuyButton />);
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
