'use client';

import React, {ChangeEvent, useEffect, useState} from "react";
import {SliderInput} from "@/app/components/ui/SliderInput";

export default function AffordabilityCalculator() {
    const defaultInterestRate: number = 5.0
    const [income, setIncome] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [interestRate, setInterestRate] = useState(defaultInterestRate); // Default interest rate
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [maxed, setMaxed] = React.useState<boolean>(false);
    const [result, setResult] = useState("");


    useEffect(() => {
        const payments = 25 * 12;
        const maxMortgage = income * 4.5; // Adjust based on interest rate
        // Monthly interest rate
        const monthlyRate = interestRate / 100 / 12;
        const x = Math.pow(1 + monthlyRate, payments);
        const monthlyPayment = ((maxMortgage * x * monthlyRate) / (x - 1));
        // find max mortgage payment
        const maxMonthlyPayment = (income / 12) - expenses;
        if (monthlyPayment > maxMonthlyPayment) {
            if (maxMonthlyPayment < 0){
                setResult("Too Many Expenses");
                setMonthlyPayment(0)
                return
            }
            // P = PMT × [1 - (1 + r)^(-n)] ÷ r
            const maxMonthMortgage = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -payments)) / monthlyRate);

            setResult("£" + (maxMonthMortgage + deposit).toFixed(0));
            setMonthlyPayment(+maxMonthlyPayment.toFixed(2))
            setMaxed(true);
        } else {
            setResult("£" + (maxMortgage + deposit).toFixed(0));
            setMonthlyPayment(+monthlyPayment.toFixed(2));
            setMaxed(false);
        }
    }, [income, deposit, expenses, interestRate, maxed]);

    const handleInterestRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = parseFloat(e.target.value);
        setInterestRate(value);
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <div className="w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Mortgage Affordability Calculator</h3>
                <p className="mb-6 text-gray-700">How much can I afford for a mortgage? A good rule of thumb is that you can borrow between 4 and 4.5 times your total household income. Use our calculator to see your borrowing limit and estimate an affordable house price.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Total Annual Household Income (£):</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 50000"
                            value={income || ''}
                            onChange={(e) => setIncome(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Total Deposit (£):</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 25000"
                            value={deposit || ''}
                            onChange={(e) => setDeposit(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Monthly Committed Expenses (£):</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 500"
                            value={expenses || ''}
                            onChange={(e) => setExpenses(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <SliderInput
                        label="Projected Interest Rate"
                        value={interestRate}
                        onChange={handleInterestRateChange}
                        min={0.1}
                        max={20}
                        step={0.1}
                        unit="%"
                    />
                </div>
                {result && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-lg font-semibold text-blue-900 text-center">
                            Estimated Affordable House Price
                        </div>
                        <div className="mt-2 text-3xl font-bold text-center text-blue-700">
                            {result}
                        </div>
                        <div className={`mt-4 p-3 rounded-lg text-center font-bold ${maxed ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
                                Estimated Monthly Payment: £{monthlyPayment.toLocaleString()}
                        </div>
                        {maxed && (
                            <p className="mt-2 text-sm text-red-600 text-center italic">
                                Note: This is limited by your monthly budget.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
