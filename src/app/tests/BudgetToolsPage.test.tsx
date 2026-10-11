import "@testing-library/jest-dom";
import { describe, expect, test } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import Budget from "@/app/tools/budget/page";

jest.mock("react-chartjs-2", () => ({
  Doughnut: () => <div data-testid="mock-chart" />,
}));

afterEach(() => cleanup());

describe("Budget tools page", () => {
  test("links to the paid guide as a next step, tagged with its entry source", () => {
    render(<Budget />);
    expect(screen.getByRole("link", { name: /give every pound a job/i })).toHaveAttribute(
      "href",
      "/guide/give-every-pound-a-job?from=budget-planner"
    );
  });
});
