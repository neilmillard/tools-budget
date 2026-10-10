import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import { Footer } from "@/app/components/Footer";

afterEach(() => cleanup());

describe("Footer", () => {
  test("links to the 30-day challenge page site-wide", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /30-day.*challenge/i })).toHaveAttribute(
      "href",
      "/challenge/give-every-pound-a-job/"
    );
  });
});
