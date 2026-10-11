import "@testing-library/jest-dom";
import { describe, expect, test, beforeEach } from "@jest/globals";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import NewsletterForm from "@/app/components/NewsletterForm";

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

afterEach(() => cleanup());

describe("NewsletterForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  test("does not render a raw email address (triggers Cloudflare email obfuscation, breaking crawlers)", () => {
    const { container } = render(<NewsletterForm />);

    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    expect(container.innerHTML).not.toMatch(emailPattern);
  });

  test("renders an email input and a submit button", () => {
    render(<NewsletterForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /checklist/i })).toBeInTheDocument();
  });

  test("posts the email to /api/newsletter-signup and shows the success message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "You're subscribed. Check your inbox for the checklist." }),
    });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /checklist/i }));

    expect(await screen.findByText(/subscribed/i)).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/newsletter-signup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com" }),
      })
    );
  });

  test("shows an error message when signup fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Failed to subscribe. Please try again later." }),
    });

    render(<NewsletterForm />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /checklist/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to subscribe/i);
  });

  test("includes a hidden honeypot field", () => {
    const { container } = render(<NewsletterForm />);
    expect(container.querySelector('input[name="_gotcha"]')).not.toBeNull();
  });
});
