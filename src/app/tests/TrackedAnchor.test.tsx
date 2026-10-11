import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import TrackedAnchor from "@/app/components/blog/TrackedAnchor";

afterEach(() => cleanup());

describe("TrackedAnchor", () => {
  test("fires guide_link_click for a guide link, with the source from its query string", () => {
    window.gtag = jest.fn();
    render(<TrackedAnchor href="/guide/give-every-pound-a-job/?from=blog-50-30-20">Give Every Pound a Job guide</TrackedAnchor>);
    fireEvent.click(screen.getByRole("link", { name: /give every pound a job guide/i }));
    expect(window.gtag).toHaveBeenCalledWith("event", "guide_link_click", { source: "blog-50-30-20" });
  });

  test("does not track clicks on unrelated links", () => {
    window.gtag = jest.fn();
    render(<TrackedAnchor href="https://www.moneyhelper.org.uk/">MoneyHelper</TrackedAnchor>);
    fireEvent.click(screen.getByRole("link", { name: /moneyhelper/i }));
    expect(window.gtag).not.toHaveBeenCalled();
  });
});
