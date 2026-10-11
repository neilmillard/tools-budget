import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import GuideCTALink from "@/app/components/GuideCTALink";

afterEach(() => cleanup());

describe("GuideCTALink", () => {
  test("renders a link to the given href", () => {
    render(<GuideCTALink href="/guide/give-every-pound-a-job/?from=budget-planner">Give Every Pound a Job</GuideCTALink>);
    expect(screen.getByRole("link", { name: /give every pound a job/i })).toHaveAttribute(
      "href",
      "/guide/give-every-pound-a-job?from=budget-planner"
    );
  });

  test("fires guide_link_click with the source from the href on click", () => {
    window.gtag = jest.fn();
    render(<GuideCTALink href="/guide/give-every-pound-a-job/?from=budget-planner">Give Every Pound a Job</GuideCTALink>);
    fireEvent.click(screen.getByRole("link", { name: /give every pound a job/i }));
    expect(window.gtag).toHaveBeenCalledWith("event", "guide_link_click", { source: "budget-planner" });
  });
});
