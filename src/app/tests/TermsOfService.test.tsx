import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import TermsOfServiceComponent from "@/app/components/TermsOfServiceComponent";

afterEach(() => cleanup());

describe("TermsOfServiceComponent", () => {
  test("states the no-refund-after-download policy and the 7-day contact window for the paid guide", () => {
    render(<TermsOfServiceComponent />);
    expect(
      screen.getByText(/we don.t offer refunds once a guide has been downloaded/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/within 7 days of purchase/i)).toBeInTheDocument();
  });

  test("explains the digital-content cancellation right and how consent at checkout waives it", () => {
    render(<TermsOfServiceComponent />);
    expect(screen.getByText(/Consumer Contracts/i)).toBeInTheDocument();
    expect(screen.getByText(/14 days/i)).toBeInTheDocument();
    expect(screen.getByText(/ticking the consent box at checkout/i)).toBeInTheDocument();
  });
});
