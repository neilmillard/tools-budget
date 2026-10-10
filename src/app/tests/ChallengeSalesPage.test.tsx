import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
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
      "/guide/give-every-pound-a-job"
    );
  });

  test("makes no investment, bank or product recommendations", () => {
    render(<ChallengeSalesPageContent />);
    expect(
      screen.getByText(/does not recommend any specific bank, app, savings product or investment/i)
    ).toBeInTheDocument();
  });
});
