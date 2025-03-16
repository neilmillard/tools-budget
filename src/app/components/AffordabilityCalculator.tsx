'use client';

import React, {ChangeEvent, useEffect, useState} from "react";
import {SliderInput} from "@/app/components/SliderInput";

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
                <h3 className="text-xl font-bold mb-4">UK House Affordability Calculator</h3>
                <p className="p-6">A good rule of thumb is that you can borrow between 4 and 4.5 times your total household income.

                    See how much you can and should borrow for a mortgage.</p>
                <label>Annual Income (£):</label>
                <input
                    type="number"
                    className="flex w-[43%] p-2 border rounded"
                    placeholder="Enter your income"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                />
                <label>Deposit (£):</label>
                <input
                    type="number"
                    className="flex w-[43%] p-2 border rounded"
                    placeholder="Enter your deposit"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                />
                <label>Monthly Expenses (£):</label>
                <input
                    type="number"
                    className="flex w-[43%] p-2 border rounded"
                    placeholder="Enter monthly expenses"
                    value={expenses}
                    onChange={(e) => setExpenses(Number(e.target.value))}
                />
                <SliderInput
                    label="Interest Rate"
                    value={interestRate}
                    onChange={handleInterestRateChange}
                    min={0.1}
                    max={20}
                    step={0.1}
                    unit="%"
                />
                {result && (
                    <div>
                        <div className="mt-4 text-lg font-semibold">
                            Estimated Affordable House Price:
                        </div>
                        <div className="mt-4 text-xl font-bold justify-center flex">
                            {result}
                        </div>
                        <div className={`mt-4 text-l font-bold justify-center flex ${maxed ? "bg-red-500 text-white" : "text-black"}`}>
                                Estimated Monthly Payment: £{monthlyPayment}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
