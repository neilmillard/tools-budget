'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {CurrencyInput} from "@/app/components/CurrencyInput";
import {SliderInput} from "@/app/components/SliderInput";
import {ResultsPanel} from "@/app/components/ResultsPanel";

// Main component
const MortgageCalculator: React.FC = () => {
    // Default values
    const [propertyPrice, setPropertyPrice] = useState<number>(300000);
    const [deposit, setDeposit] = useState<number>(30000);
    const [mortgageAmount, setMortgageAmount] = useState<number>(propertyPrice - deposit);
    const [interestRate, setInterestRate] = useState<number>(4.5);
    const [term, setTerm] = useState<number>(25);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalPaid, setTotalPaid] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);

    // Calculate mortgage payments
    useEffect(() => {
        // Update mortgage amount when property price or deposit changes
        setMortgageAmount(propertyPrice - deposit);

        // Monthly interest rate
        const monthlyRate = interestRate / 100 / 12;

        // Total number of payments
        const payments = term * 12;

        // Calculate monthly payment
        if (monthlyRate === 0) {
            setMonthlyPayment(mortgageAmount / payments);
        } else {
            const x = Math.pow(1 + monthlyRate, payments);
            setMonthlyPayment((mortgageAmount * x * monthlyRate) / (x - 1));
        }
    }, [propertyPrice, deposit, mortgageAmount, interestRate, term]);

    // Calculate total amounts
    useEffect(() => {
        const totalAmount = monthlyPayment * term * 12;
        setTotalPaid(totalAmount);
        setTotalInterest(totalAmount - mortgageAmount);
    }, [monthlyPayment, term, mortgageAmount]);

    // Handle input changes
    const handlePropertyPriceChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = parseFloat(e.target.value) || 0;
        setPropertyPrice(value);
    };

    const handleDepositChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = parseFloat(e.target.value) || 0;
        setDeposit(value);
    };

    const handleInterestRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = parseFloat(e.target.value);
        setInterestRate(value);
    };

    const handleTermChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = parseInt(e.target.value);
        setTerm(value);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Mortgage Calculator</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <CurrencyInput
                        label="Property Price"
                        value={propertyPrice}
                        onChange={handlePropertyPriceChange}
                        currencySymbol="£"
                    />

                    <CurrencyInput
                        label="Deposit"
                        value={deposit}
                        onChange={handleDepositChange}
                        currencySymbol="£"
                    />

                    <SliderInput
                        label="Interest Rate"
                        value={interestRate}
                        onChange={handleInterestRateChange}
                        min={0.1}
                        max={10}
                        step={0.1}
                        unit="%"
                    />

                    <SliderInput
                        label="Term"
                        value={term}
                        onChange={handleTermChange}
                        min={5}
                        max={40}
                        step={1}
                        unit=" years"
                    />
                </div>

                <ResultsPanel
                    mortgageAmount={mortgageAmount}
                    monthlyPayment={monthlyPayment}
                    totalPaid={totalPaid}
                    totalInterest={totalInterest}
                    term={term}
                    propertyPrice={propertyPrice}
                />
            </div>
        </div>
    );
};

export default MortgageCalculator;
