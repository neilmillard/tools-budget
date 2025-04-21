import {render, screen, fireEvent, cleanup} from "@testing-library/react";
import "@testing-library/jest-dom";
import BudgetPlanner from "@/app/components/calculators/BudgetPlanner";
import {describe, test} from "@jest/globals";

// Mock Chart.js to prevent rendering errors
jest.mock("react-chartjs-2", () => ({
    Doughnut: () => <div data-testid="mock-chart" />,
}));

// Mock window.history.replaceState to prevent test errors
beforeAll(() => {
    global.window.history.replaceState = jest.fn();
});

describe("BudgetPlanner Component", () => {
    test("renders without crashing", () => {
        render(<BudgetPlanner />);
        expect(screen.getByText("Budget Planner")).toBeInTheDocument();
        cleanup()
    });

    test("renders all category tabs", () => {
        render(<BudgetPlanner />);
        const tabs = ["Income", "Bills", "Living", "Finance", "Family", "Travel", "Leisure", "Summary"];
        tabs.forEach(tab => {
            expect(screen.getByRole('button', {name: tab})).toBeInTheDocument();
        });
        cleanup()
    });

    test("updates total income when salary is entered", () => {
        render(<BudgetPlanner />);
        const salaryInput = screen.getByLabelText("salary");
        fireEvent.change(salaryInput, { target: { value: "3000" } });
        const element = screen.getByLabelText("income");
        expect(element).toBeInTheDocument();
        expect(element).toContainHTML("<td class=\"text-md\" aria-label=\"income\"><b>£3000.00</b></td>")
        cleanup()
    });

    test("calculates total expenses correctly", () => {
        render(<BudgetPlanner />);
        fireEvent.click(screen.getByText("Bills"));
        const rentInput = screen.getByLabelText('rent');
        fireEvent.change(rentInput, { target: { value: "1000" } });

        fireEvent.click(screen.getByText("Summary"));
        const element = screen.getByLabelText('expenses');
        expect(element).toBeInTheDocument();
        expect(element).toContainHTML("<td class=\"text-md\" aria-label=\"expenses\"><b>£1000.00</b></td>")
        cleanup()
    });
});
