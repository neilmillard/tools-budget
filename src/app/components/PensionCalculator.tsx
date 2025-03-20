'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {CurrencyInput} from "@/app/components/CurrencyInput";
import {CurrencySelector, currencies, Currency, currencyLookup} from "@/app/components/Currency";
import SavingsChart, {DataPoint} from "@/app/components/SavingsChart";


interface Results {
  totalSavings: number;
  monthlyIncome: number;
  savingsChart: DataPoint[];
}

export default function PensionCalculator() {
  // State for form inputs
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSalary, setCurrentSalary] = useState<number>(50000);
  const [currentSavings, setCurrentSavings] = useState<number>(10000);
  const [monthlySavings, setMonthlySavings] = useState<number>(500);
  const [employerMatch, setEmployerMatch] = useState<number>(3);
  const [annualReturn, setAnnualReturn] = useState<number>(5);
  const [annualSalaryIncrease, setAnnualSalaryIncrease] = useState<number>(2);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(5);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  // State for results
  const [results, setResults] = useState<Results>({
    totalSavings: 0,
    monthlyIncome: 0,
    savingsChart: []
  });

  // Calculate pension on input change
  useEffect(() => {
    const yearsToRetirement = retirementAge - currentAge;
    let totalSavings = currentSavings;
    let currentSal = currentSalary;
    let monthlySave = monthlySavings;
    const monthlyReturnRate = annualReturn / 100 / 12;
    const chart: DataPoint[] = [];

    // Calculate for each year
    for (let year = 0; year <= yearsToRetirement; year++) {
      // Calculate for each month in the year
      for (let month = 0; month < 12; month++) {
        // Skip calculations for year 0, just add to chart
        if (year === 0 && month === 0) {
          chart.push({
            age: currentAge,
            savings: Math.round(totalSavings)
          });
          continue;
        }

        // Employee contribution
        totalSavings += monthlySave;

        // Employer match
        const employerContribution = (monthlySave * employerMatch / 100);
        totalSavings += employerContribution;

        // Interest earned
        totalSavings *= (1 + monthlyReturnRate);
      }

      // Annual salary increase
      if (year < yearsToRetirement) {
        currentSal *= (1 + annualSalaryIncrease / 100);
        monthlySave = (monthlySavings / currentSalary) * currentSal;
      }

      // Record data point for chart
      chart.push({
        age: currentAge + year,
        savings: Math.round(totalSavings)
      });
    }

    const retirmentSavings = totalSavings;

    const withdrawRatePercent: number = withdrawalRate / 100
    const monthlyIncome: number = (totalSavings * withdrawRatePercent) / 12;

    for (let year: number = retirementAge; year < 105; year++) {
      // Calculate for each month in the year
      for (let month = 0; month < 12; month++) {
        totalSavings -= monthlyIncome;
        // Interest earned
        totalSavings *= (1 + monthlyReturnRate);
      }

      // Skip calculations for year 0, just add to chart
      if (year === 0) {
        continue;
      }
      chart.push({
        age: year,
        savings: Math.round(totalSavings)
      });

      if (totalSavings < 0) {
        break;
      }
    }

    setResults({
      totalSavings: Math.round(retirmentSavings),
      monthlyIncome: Math.round(monthlyIncome),
      savingsChart: chart
    });
  }, [currentAge, retirementAge, currentSalary, currentSavings, monthlySavings, employerMatch, annualReturn, annualSalaryIncrease, withdrawalRate]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Pension Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form inputs */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Information</h3>

          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCurrency(currencyLookup(e.target.value))}
          />

          <CurrencyInput
            label="Current Age"
            value={currentAge}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentAge(Number(e.target.value))}
            min={18}
            max={100}
          />

          <CurrencyInput
            label="Retirement Age"
            value={retirementAge}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRetirementAge(Number(e.target.value))}
            min={currentAge + 1}
            max={100}
          />

          <CurrencyInput
            label={"Current Annual Salary (" + selectedCurrency.symbol + ")"}
            value={currentSalary}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentSalary(Number(e.target.value))}
            min={0}
            step={1000}
          />

          <CurrencyInput
            label={"Current Savings / Pension Value (" + selectedCurrency.symbol + ")"}
            value={currentSavings}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentSavings(Number(e.target.value))}
            min={0}
            step={1000}
          />

          <CurrencyInput
            label={"Monthly Contributions (" + selectedCurrency.symbol + ")"}
            value={monthlySavings}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMonthlySavings(Number(e.target.value))}
            min={0}
          />

          <CurrencyInput
            label="Employer Match (%)"
            value={employerMatch}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmployerMatch(Number(e.target.value))}
            min={0}
            max={100}
            step={0.1}
          />

          <CurrencyInput
            label="Expected Annual Return (%)"
            value={annualReturn}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAnnualReturn(Number(e.target.value))}
            min={0}
            max={20}
            step={0.1}
          />

          <CurrencyInput
            label="Annual Salary Increase (%)"
            value={annualSalaryIncrease}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAnnualSalaryIncrease(Number(e.target.value))}
            min={0}
            max={20}
            step={0.1}
          />

          <CurrencyInput
            label="Desired withdrawal rate (%)"
            value={withdrawalRate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWithdrawalRate(Number(e.target.value))}
            min={0}
            max={20}
            step={0.1}
          />
        </div>

        {/* Results */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Your Retirement Projection</h3>

          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h4 className="text-lg font-medium mb-2">Total Savings at Retirement</h4>
              <p className="text-3xl font-bold text-blue-600">{selectedCurrency.symbol}{results.totalSavings.toLocaleString()}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-lg font-medium mb-2">Estimated Monthly Income</h4>
              <p className="text-3xl font-bold text-green-600">{selectedCurrency.symbol}{results.monthlyIncome.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Based on {withdrawalRate}% annual withdrawal rate</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <SavingsChart chart={results.savingsChart} label={"Retirement Account Balance"} responsive={true}/>
      </div>
    </div>
  );
}
