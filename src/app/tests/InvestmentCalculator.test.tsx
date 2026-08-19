import {render, screen, fireEvent, cleanup, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import InvestmentCalculator from "@/app/components/calculators/InvestmentCalculator";
import {describe, test} from "@jest/globals";

// Mock Chart.js so the (lazy-loaded) chart doesn't try to touch the canvas APIs jsdom lacks
jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="mock-chart" />,
}));

beforeAll(() => {
  global.window.history.replaceState = jest.fn();
});

describe("InvestmentCalculator Component", () => {
  test("renders without crashing and without the chart before a calculation", () => {
    render(<InvestmentCalculator />);
    expect(screen.getByRole("button", {name: "Calculate"})).toBeInTheDocument();
    expect(screen.queryByTestId("mock-chart")).not.toBeInTheDocument();
    cleanup();
  });

  test("lazy-loads the chart only after Calculate is clicked", async () => {
    render(<InvestmentCalculator />);
    fireEvent.click(screen.getByRole("button", {name: "Calculate"}));
    await waitFor(() => expect(screen.getByTestId("mock-chart")).toBeInTheDocument());
    cleanup();
  });
});
