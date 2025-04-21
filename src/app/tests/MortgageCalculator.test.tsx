import React from 'react';
import {render, screen, fireEvent, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom';
import MortgageCalculator from "@/app/components/calculators/MortgageCalculator";


describe('MortgageCalculator', () => {
    // Test rendering
    it('renders without crashing', () => {
        render(<MortgageCalculator />);
        expect(screen.getByText('Mortgage Calculator')).toBeInTheDocument();
        cleanup()
    });

    // Test initial state
    it('displays correct initial values', () => {
        render(<MortgageCalculator />);

        // Check initial defaults
        expect(screen.getByLabelText('Property Price')).toHaveValue(300000)
        expect(screen.getByLabelText('Deposit')).toHaveValue(30000)

        // Check initial mortgage amount calculation
        expect(screen.getByText('Mortgage amount')).toBeInTheDocument();
        expect(screen.getByText('£270,000.00')).toBeInTheDocument();

        // Check initial monthly payment
        const monthlyPaymentElement = screen.getByText(/£1,500.75/);
        expect(monthlyPaymentElement).toBeInTheDocument();
        cleanup()
    });

    // Test property price change
    it('updates calculations when property price changes', () => {
        render(<MortgageCalculator />);

        const propertyPriceInput = screen.getByLabelText('Property Price');
        fireEvent.change(propertyPriceInput, { target: { value: '400000' } });

        // Check updated mortgage amount
        expect(screen.getByText('£370,000.00')).toBeInTheDocument();

        // Check updated monthly payment
        // This assumes a default interest rate of 4.5%
        expect(screen.getByText(/£2,056.58/)).toBeInTheDocument();
        cleanup()
    });

    // Test deposit change
    it('updates calculations when deposit changes', () => {
        render(<MortgageCalculator />);

        const depositInput = screen.getByLabelText('Deposit');
        fireEvent.change(depositInput, { target: { value: '100000' } });

        // Check updated mortgage amount
        expect(screen.getByText('£200,000.00')).toBeInTheDocument();

        // Check updated monthly payment
        expect(screen.getByText(/£1,111.66/)).toBeInTheDocument();

        cleanup()
    });

    // Test interest rate slider
    it('updates calculations when interest rate changes', () => {
        render(<MortgageCalculator />);

        const interestRateSlider = screen.getByLabelText(/Interest Rate/);
        fireEvent.change(interestRateSlider, { target: { value: '6' } });

        // Check that the interest rate display updates
        expect(screen.getByText(/Interest Rate: 6%/)).toBeInTheDocument();

        // Check updated monthly payment with higher interest rate
        expect(screen.getByText(/£1,739.61/)).toBeInTheDocument();

        cleanup()
    });

    // Test term slider
    it('updates calculations when term changes', () => {
        render(<MortgageCalculator />);

        const termSlider = screen.getByLabelText(/Term/);
        fireEvent.change(termSlider, { target: { value: '30' } });

        // Check that the term display updates
        expect(screen.getByText(/Term: 30 years/)).toBeInTheDocument();

        // Check updated monthly payment with longer term
        expect(screen.getByText(/£1,368.05/)).toBeInTheDocument();

        cleanup()
    });

    // Test LTV calculation
    it('calculates LTV correctly', () => {
        render(<MortgageCalculator />);

        // Initial LTV should be around 87.1%
        expect(screen.getByText('90.0%')).toBeInTheDocument();

        // Change deposit to alter LTV
        const depositInput = screen.getByLabelText('Deposit');
        fireEvent.change(depositInput, { target: { value: '150000' } });

        // New LTV should be 50%
        expect(screen.getByText('50.0%')).toBeInTheDocument();

        cleanup()
    });

    // Test total interest calculation
    it('calculates total interest correctly', () => {
        render(<MortgageCalculator />);

        // Initial values
        expect(screen.getByText(/Total interest paid/)).toBeInTheDocument();

        // Change term to check interest recalculation
        const termSlider = screen.getByLabelText(/Term/);
        fireEvent.change(termSlider, { target: { value: '10' } });

        // Check if total interest is reduced with shorter term
        // This is a relative test comparing the values
        const totalInterestBefore = screen.getByText(/Total interest paid/).nextElementSibling?.textContent;

        // Change back to longer term
        fireEvent.change(termSlider, { target: { value: '25' } });

        // Check if total interest is increased with longer term
        const totalInterestAfter = screen.getByText(/Total interest paid/).nextElementSibling?.textContent;

        // Convert to numbers for comparison (remove currency symbol and commas)
        const interestBefore = parseFloat(totalInterestBefore?.replace(/[^0-9.-]+/g, '') || '0');
        const interestAfter = parseFloat(totalInterestAfter?.replace(/[^0-9.-]+/g, '') || '0');

        expect(interestAfter).toBeGreaterThan(interestBefore);

        cleanup()
    });

    // Test extreme values
    it('handles extreme values appropriately', () => {
        render(<MortgageCalculator />);

        // Test with very low interest rate
        const interestRateSlider = screen.getByLabelText(/Interest Rate/);
        fireEvent.change(interestRateSlider, { target: { value: '0.1' } });

        // Should still show sensible values
        expect(screen.getByText(/£911.33/)).toBeInTheDocument();

        // Test with very short term
        const termSlider = screen.getByLabelText(/Term/);
        fireEvent.change(termSlider, { target: { value: '5' } });

        // Should show much higher monthly payment
        expect(screen.getByText(/£4,511.45/)).toBeInTheDocument();

        cleanup()
    });

    // Test component structure
    it('has the correct structure of components', () => {
        render(<MortgageCalculator />);

        // Check for two CurrencyInput components
        expect(screen.getAllByText(/£/).length).toBeGreaterThanOrEqual(2);

        // Check for two SliderInput components
        const sliders = document.querySelectorAll('input[type="range"]');
        expect(sliders.length).toBe(2);

        // Check for results panel
        expect(screen.getByText('Your Results')).toBeInTheDocument();

        cleanup()
    });
});
