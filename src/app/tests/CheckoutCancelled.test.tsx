import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import CheckoutCancelled, { metadata } from "@/app/checkout-cancelled/page";

afterEach(() => cleanup());

describe("CheckoutCancelled page", () => {
  test("is not indexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  test("tells the user no payment was taken and links back to checkout", () => {
    render(<CheckoutCancelled />);
    expect(screen.getByText(/no payment was taken/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to checkout/i })).toHaveAttribute("href", "/test-checkout");
  });
});
