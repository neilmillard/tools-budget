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

  test("shows the Stripe session id as a reference when present", () => {
    window.history.pushState({}, "", "/thank-you?session_id=cs_test_abc123");
    render(<ThankYouContent />);
    expect(screen.getByText(/cs_test_abc123/)).toBeInTheDocument();
  });

  test("omits the reference line when there is no session id", () => {
    render(<ThankYouContent />);
    expect(screen.queryByText(/Reference:/)).not.toBeInTheDocument();
  });
});
