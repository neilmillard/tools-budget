import "@testing-library/jest-dom";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import ChallengeSignupForm from "@/app/components/ChallengeSignupForm";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

afterEach(() => cleanup());

describe("ChallengeSignupForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("renders an email input and a submit button", () => {
    render(<ChallengeSignupForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  test("posts the email to /api/challenge-signup and shows the success message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "You're signed up — Day 1 starts now." }),
    });

    render(<ChallengeSignupForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(await screen.findByText(/day 1 starts now/i)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/challenge-signup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com" }),
      })
    );
  });

  test("shows an error message when signup fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Failed to sign up. Please try again later." }),
    });

    render(<ChallengeSignupForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to sign up/i);
  });

  test("includes a hidden honeypot field", () => {
    const { container } = render(<ChallengeSignupForm />);
    expect(container.querySelector('input[name="_gotcha"]')).not.toBeNull();
  });

  test("shows the Day 1 action and a worksheet link after a successful signup", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "You're signed up. Here's Day 1. The rest comes by email." }),
    });

    render(<ChallengeSignupForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(
      await screen.findByText(/write down every pound you spent yesterday\. no judgment, just the list\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /worksheet/i })).toHaveAttribute(
      "href",
      "/download/Give Every Pound a Job - Budget Worksheet.xlsx"
    );
  });

  test("does not show the Day 1 action or worksheet link when signup fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Failed to sign up. Please try again later." }),
    });

    render(<ChallengeSignupForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    await screen.findByRole("alert");
    expect(
      screen.queryByText(/write down every pound you spent yesterday/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /worksheet/i })).not.toBeInTheDocument();
  });
});
