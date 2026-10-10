import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import GuideSalesPageContent from "@/app/components/GuideSalesPageContent";

afterEach(() => cleanup());

describe("GuideSalesPageContent", () => {
  test("shows the guide title and at least one buy button", () => {
    render(<GuideSalesPageContent />);
    expect(screen.getByRole("heading", { name: /give every pound a job/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /buy the guide/i }).length).toBeGreaterThan(0);
  });

  test("tells the buyer the guide is a PDF", () => {
    render(<GuideSalesPageContent />);
    expect(screen.getByText(/a PDF, 15–20 minute read/i)).toBeInTheDocument();
  });

  test("links to the free worksheet download, not the paid guide file", () => {
    render(<GuideSalesPageContent />);
    const worksheetLink = screen.getByRole("link", { name: /free budget worksheet/i });
    expect(worksheetLink).toHaveAttribute(
      "href",
      "/download/Give%20Every%20Pound%20a%20Job%20-%20Budget%20Worksheet.xlsx"
    );
  });

  test("links to the contact page for download problems, not a hard-coded email", () => {
    render(<GuideSalesPageContent />);
    expect(screen.getByRole("link", { name: /contact page/i })).toHaveAttribute("href", "/contact");
  });

  test("states the no-refund-after-download policy and the 7-day contact window", () => {
    render(<GuideSalesPageContent />);
    expect(
      screen.getByText(/we don.t offer refunds once the guide has been downloaded/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/within 7 days of purchase/i)).toBeInTheDocument();
  });

  test("makes no investment, bank or product recommendations", () => {
    render(<GuideSalesPageContent />);
    expect(screen.getByText(/does not recommend any specific bank, app, savings product or investment/i)).toBeInTheDocument();
  });
});
