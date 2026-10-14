import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import { getEntrySourceFromSearch } from "@/lib/analytics";
import ChallengeSalesPageContent from "@/app/components/ChallengeSalesPageContent";

afterEach(() => cleanup());

describe("ChallengeSalesPageContent", () => {
  test("shows the challenge title and the signup form", () => {
    render(<ChallengeSalesPageContent />);
    expect(screen.getByRole("heading", { name: /30-day/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test("states the challenge is free", () => {
    render(<ChallengeSalesPageContent />);
    expect(screen.getAllByText(/free/i).length).toBeGreaterThan(0);
  });

  test("lists the four weekly milestones", () => {
    render(<ChallengeSalesPageContent />);
    expect(screen.getByText(/see it/i)).toBeInTheDocument();
    expect(screen.getByText(/name it/i)).toBeInTheDocument();
    expect(screen.getByText(/live it/i)).toBeInTheDocument();
    expect(screen.getByText(/keep it/i)).toBeInTheDocument();
  });

  test("links to the paid guide as the natural next step, not a hard sell", () => {
    render(<ChallengeSalesPageContent />);
    expect(screen.getByRole("link", { name: /give every pound a job/i })).toHaveAttribute(
      "href",
      "/guide/give-every-pound-a-job?from=challenge"
    );
  });

  test("tags the guide link with its entry source so a sale it drives is attributed in Stripe", () => {
    render(<ChallengeSalesPageContent />);
    const href = screen.getByRole("link", { name: /give every pound a job/i }).getAttribute("href") ?? "";
    const from = new URLSearchParams(href.slice(href.indexOf("?"))).get("from");
    expect(getEntrySourceFromSearch(`?from=${from}`)).toBe("challenge");
  });

  test("promises a weekly email, not a daily one", () => {
    render(<ChallengeSalesPageContent />);
    expect(screen.queryByText(/daily email/i)).not.toBeInTheDocument();
    expect(screen.getByText(/a short email each week with that week's actions/i)).toBeInTheDocument();
  });

  test("links straight to the free worksheet page, while the email sign-up stays the main action", () => {
    render(<ChallengeSalesPageContent />);
    expect(screen.getByRole("link", { name: /download it now/i })).toHaveAttribute(
      "href",
      "/download/budget-worksheet"
    );
    expect(screen.getByText(/or we'll send it on day 3/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test("makes no investment, bank or product recommendations", () => {
    render(<ChallengeSalesPageContent />);
    expect(
      screen.getByText(/does not recommend any specific bank, app, savings product or investment/i)
    ).toBeInTheDocument();
  });
});
