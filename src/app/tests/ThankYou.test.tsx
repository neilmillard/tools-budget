import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import { metadata } from "@/app/thank-you/page";
import ThankYouContent from "@/app/components/ThankYouContent";

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/thank-you");
});

describe("ThankYou page", () => {
  test("is not indexed", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("ThankYouContent", () => {
  test("shows a confirmation message", () => {
    render(<ThankYouContent />);
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    expect(screen.getByText(/payment was successful/i)).toBeInTheDocument();
  });

  test("shows a download button linking to /api/download with the session id, plus a reference and an email fallback line", () => {
    window.history.pushState({}, "", "/thank-you?session_id=cs_test_abc123");
    render(<ThankYouContent />);
    expect(screen.getByRole("link", { name: /download your guide/i })).toHaveAttribute(
      "href",
      "/api/download?session_id=cs_test_abc123"
    );
    expect(screen.getByText(/cs_test_abc123/)).toBeInTheDocument();
    expect(screen.getByText(/email us/i)).toBeInTheDocument();
  });

  test("omits the download button and reference line when there is no session id", () => {
    render(<ThankYouContent />);
    expect(screen.queryByRole("link", { name: /download your guide/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Reference:/)).not.toBeInTheDocument();
  });
});
