import "@testing-library/jest-dom";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import BuyButton from "@/app/components/BuyButton";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

afterEach(() => cleanup());

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
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /buy/i }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("https://checkout.stripe.com/c/pay/cs_test_abc"));
    expect(mockFetch).toHaveBeenCalledWith("/api/checkout", { method: "POST" });
  });

  test("shows an error message when checkout cannot be started", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Checkout is not configured yet." }),
    });
    const navigate = jest.fn();

    render(<BuyButton navigate={navigate} />);
    fireEvent.click(screen.getByRole("checkbox"));
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
