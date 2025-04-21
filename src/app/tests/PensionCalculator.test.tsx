import "@testing-library/jest-dom";
import {render, screen, fireEvent, cleanup} from "@testing-library/react";
import PensionCalculator from "../components/calculators/PensionCalculator";
import {currencies} from "@/app/components/ui/Currency";

// Mock Chart.js to prevent rendering errors
jest.mock("react-chartjs-2", () => ({
    Bar: () => <div data-testid="mock-chart" />,
}));

const originalLocation = window.location;

beforeEach(() => {
    // Save the original window.location
    Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...originalLocation, search: '' }
    });
});

describe("PensionCalculator", () => {
    test("renders correctly", () => {
        render(<PensionCalculator />);
        expect(screen.getByText("Pension Calculator")).toBeInTheDocument();
        expect(screen.getByText("Your Information")).toBeInTheDocument();
        expect(screen.getByText("Your Retirement Projection")).toBeInTheDocument();

        cleanup();
    });

    test("has correct default values", () => {
        render(<PensionCalculator />);
        expect(screen.getByLabelText(/Current Age/i)).toHaveValue(30);
        expect(screen.getByLabelText(/Retirement Age/i)).toHaveValue(65);
        expect(screen.getByLabelText(/Current Annual Salary/i)).toHaveValue(50000);
        expect(screen.getByLabelText(/Current Savings/i)).toHaveValue(10000);
        expect(screen.getByLabelText(/Monthly Contributions/i)).toHaveValue(500);
        expect(screen.getByLabelText(/Employer Match/i)).toHaveValue(3);
        expect(screen.getByLabelText(/Expected Annual Return/i)).toHaveValue(5);
        expect(screen.getByLabelText(/Annual Salary Increase/i)).toHaveValue(2);

        // Check default currency selection
        const currencySelect = screen.getByRole("combobox");
        expect(currencySelect).toHaveValue(currencies[0].code);

        cleanup();
    });

    test("updates inputs and calculates pension", () => {
        render(<PensionCalculator />);

        const salaryInput = screen.getByLabelText(/Current Annual Salary/i);
        fireEvent.change(salaryInput, {target: {value: "60000"}});
        expect(salaryInput).toHaveValue(60000);
        const savingsInput = screen.getByLabelText(/Current Savings/i);
        fireEvent.change(savingsInput, {target: {value: "20000"}});
        expect(screen.getByText("$929,417")).toBeInTheDocument();

        cleanup()
    })

    test("changes currency and updates displayed symbol", () => {
        render(<PensionCalculator />);

        const currencySelect = screen.getByRole("combobox");
        fireEvent.change(currencySelect, { target: { value: "EUR" } });
        expect(screen.getByText("€869,397")).toBeInTheDocument();

        cleanup();
    });

    test('loads with encoded parameters', () => {
        // Sample encoded data
        const sampleData = {
            currentAge: '45',
            retirementAge: '70',
            // Other fields
        };
        const encodedData = btoa(JSON.stringify(sampleData));

        // Set URL search params
        window.location.search = `?data=${encodedData}`;

        render(<PensionCalculator />);

        // Your assertions here
        expect(screen.getByLabelText(/Current Age/i)).toHaveValue(45);
    });
})