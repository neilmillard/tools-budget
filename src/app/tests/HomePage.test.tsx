import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import Home from "@/app/page";

afterEach(() => cleanup());

describe("Home", () => {
  test("links to the 30-day challenge", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: /30-day.*challenge/i })).toHaveAttribute(
      "href",
      "/challenge/give-every-pound-a-job"
    );
  });
});
