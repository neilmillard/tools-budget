import React from 'react';
import {cleanup, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import FinancialSteps from '../components/FinancialSteps'; // Adjust path as needed

/**
 * Converts a hex color code to RGB format
 * @param hex - Hex color code (with or without #)
 * @returns RGB color string in format "rgb(r, g, b)"
 */
function hexToRgb(hex: string): string {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Return RGB format
    return `rgb(${r}, ${g}, ${b})`;
}

describe('FinancialSteps Component', () => {
    beforeEach(() => {
        render(<FinancialSteps />);
    });

    // Clean up after each test
    afterEach(() => {
        cleanup();
    });

    it('renders all four step numbers', () => {
        // Check if all step numbers are rendered
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders all step titles correctly', () => {
        // Check if all step titles are rendered
        expect(screen.getByText('Paying Debt')).toBeInTheDocument();
        expect(screen.getByText('Saving')).toBeInTheDocument();
        // Using regex to match "Buying a Home" across line breaks
        expect(screen.getByText(/Buying a\s*Home/)).toBeInTheDocument();
        expect(screen.getByText('Investing')).toBeInTheDocument();
    });

    it('renders the correct number of steps', () => {
        // Check if there are four steps total
        const steps = screen.getAllByRole('heading', { level: 3 });
        expect(steps).toHaveLength(4);
    });

    it('applies the correct background colors', () => {
        const hexColors = ['#ffaa66', '#f7dc6f', '#c6e07f', '#a7e0a5'];
        const stepBoxes = document.querySelectorAll('[style*="background-color"]');
        expect(stepBoxes).toHaveLength(4);

        // We can verify color presence in the style attribute
        hexColors.forEach((hex, index) => {
            const rgbColor = hexToRgb(hex);
            expect(stepBoxes[index].getAttribute('style')).toContain(rgbColor);
        });
    });

    it('has circles with numbers for each step', () => {
        // Check if we have four circular elements
        const circularElements = document.querySelectorAll('.rounded-full');
        expect(circularElements).toHaveLength(4);

        // Make sure each circle contains a number
        circularElements.forEach((element, index) => {
            expect(element.textContent).toContain(String(index + 1));
        });
    });

    it('applies responsive classes', () => {
        // Check for responsive class indicators
        const columns = document.querySelectorAll('.w-full.sm\\:w-64');
        expect(columns).toHaveLength(4);
    });
});
