import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import "@testing-library/jest-dom";
import AffordabilityCalculator from "@/app/components/calculators/AffordabilityCalculator";



describe('AffordabilityCalculator', () => {
    // Clean up after each test
    afterEach(() => {
        cleanup();
    });

    test('renders the calculator with default values', () => {
        render(<AffordabilityCalculator />);

        expect(screen.getByText('UK House Affordability Calculator')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your income')).toHaveValue(0);
        expect(screen.getByPlaceholderText('Enter your deposit')).toHaveValue(0);
        expect(screen.getByPlaceholderText('Enter monthly expenses')).toHaveValue(0);
        expect(screen.getByLabelText('Interest Rate: 5%')).toBeInTheDocument();
    });

    test('calculates affordability when income is updated', async () => {
        render(<AffordabilityCalculator />);

        const incomeInput = screen.getByPlaceholderText('Enter your income');

        fireEvent.change(incomeInput, { target: { value: '50000' } });

        // Wait for the calculation to complete
        await waitFor(() => {
            expect(screen.getByText(/Estimated Affordable House Price:/)).toBeInTheDocument();
        });

        // With income of 50000, 4.5x multiplier, and default values
        // we should see 50000 * 4.5 = 225000
        expect(screen.getByText('£225000')).toBeInTheDocument();
    });

    test('calculates affordability with all inputs filled', async () => {
        render(<AffordabilityCalculator />);

        fireEvent.change(screen.getByPlaceholderText('Enter your income'), { target: { value: '60000' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your deposit'), { target: { value: '20000' } });
        fireEvent.change(screen.getByPlaceholderText('Enter monthly expenses'), { target: { value: '1000' } });

        // Change interest rate via mock slider
        const interestSlider = screen.getByLabelText('Interest Rate: 5%');
        fireEvent.change(interestSlider, { target: { value: '6.0' } });

        await waitFor(() => {
            expect(screen.getByText(/Estimated Affordable House Price:/)).toBeInTheDocument();
        });

        // Should show result that includes deposit
        expect(screen.getByText('£290000')).toBeInTheDocument();
    });

    test('shows "Too Many Expenses" when expenses exceed income', async () => {
        render(<AffordabilityCalculator />);

        fireEvent.change(screen.getByPlaceholderText('Enter your income'), { target: { value: '24000' } });
        fireEvent.change(screen.getByPlaceholderText('Enter monthly expenses'), { target: { value: '2500' } });

        await waitFor(() => {
            expect(screen.getByText('Too Many Expenses')).toBeInTheDocument();
        });

        expect(screen.getByText('Estimated Monthly Payment: £0')).toBeInTheDocument();
    });

    test('applies maxed styling when monthly payment exceeds limit', async () => {
        render(<AffordabilityCalculator />);

        // Set income to 48000 (4000/month) and expenses to 3000/month
        // This should trigger the maxed calculation
        fireEvent.change(screen.getByPlaceholderText('Enter your income'), { target: { value: '48000' } });
        fireEvent.change(screen.getByPlaceholderText('Enter monthly expenses'), { target: { value: '3000' } });

        await waitFor(() => {
            const paymentElement = screen.getByText(/Estimated Monthly Payment:/);
            expect(paymentElement).toHaveClass('bg-red-500');
            expect(paymentElement).toHaveClass('text-white');
        });
    });

    test('updates calculation when interest rate changes', async () => {
        render(<AffordabilityCalculator />);

        fireEvent.change(screen.getByPlaceholderText('Enter your income'), { target: { value: '50000' } });

        // Default calculation with 5% interest
        await waitFor(() => {
            expect(screen.getByText('£225000')).toBeInTheDocument();
        });

        // Change interest rate to 10%
        const interestSlider = screen.getByLabelText('Interest Rate: 5%');
        fireEvent.change(interestSlider, { target: { value: '10.0' } });

        // Expect the monthly payment to be higher with higher interest rate
        // The exact value isn't tested here since it depends on the calculation
        await waitFor(() => {
            const paymentText = screen.getByText(/Estimated Monthly Payment: £2044.58/);
            expect(paymentText).toBeInTheDocument();
        });
    });
});
