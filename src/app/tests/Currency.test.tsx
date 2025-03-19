import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import {CurrencySelector, currencyLookup, currencies} from "@/app/components/Currency";


describe("currencyLookup", () => {
    test("returns the correct currency object when a valid code is provided", () => {
        expect(currencyLookup("EUR")).toEqual({ code: "EUR", symbol: "€", name: "Euro" });
    });

    test("returns the default currency when an invalid code is provided", () => {
        expect(currencyLookup("INVALID")).toEqual(currencies[0]);
    });
});

describe("CurrencySelector", () => {
    test("renders correctly with selected currency", () => {
        render(<CurrencySelector selectedCurrency={currencies[0]} onChange={() => {}} />);
        expect(screen.getByLabelText("Currency")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toHaveValue("USD");
    });

    test("calls onChange when a different currency is selected", () => {
        const handleChange = jest.fn();
        render(<CurrencySelector selectedCurrency={currencies[0]} onChange={handleChange} />);

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "EUR" } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });
});
