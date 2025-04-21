'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {CurrencyInput} from "@/app/components/ui/CurrencyInput";
import {CurrencySelector, currencies, Currency, currencyLookup} from "@/app/components/ui/Currency";
import SavingsChart, {DataPoint} from "@/app/components/ui/SavingsChart";

interface PensionData {
  [key: string]: string
}

interface Results {
  totalSavings: number;
  monthlyIncome: number;
  savingsChart: DataPoint[];
}

export default function PensionCalculator() {
  const [pension, setPension] = useState<PensionData>({
    currentAge: '30',
    retirementAge: '65',
    currentSalary: '50000',
    currentSavings: '10000',
    monthlySavings: '500',
    employerMatch: '3',
    annualReturn: '5',
    annualSalaryIncrease: '2',
    withdrawalRate: '4',
    currencyCode: 'USD',
  });

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodeData = params.get("data")
    if (encodeData) {
      try {
        const decodedData = JSON.parse(atob(encodeData));
        setPension(decodedData);

        if (decodedData.currencyCode) {
          setSelectedCurrency(currencyLookup(decodedData.currencyCode));
        }
      } catch (error) {
        console.error("Failed to decode budget data", error);
      }
    }
  }, []);

  useEffect(() => {
    const encodedData = btoa(JSON.stringify(pension));
    window.history.replaceState({}, "", `?data=${encodedData}`);
  }, [pension]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPension((prev) => ({
      ...prev,
      [name]: value ,
    }));
  };

  const currentAge = Number(pension.currentAge || 30);
  const retirementAge = Number(pension.retirementAge || 65);
  const currentSalary = Number(pension.currentSalary || 50000);
  const currentSavings = Number(pension.currentSavings || 10000);
  const monthlySavings = Number(pension.monthlySavings || 500);
  const employerMatch = Number(pension.employerMatch || 3);
  const annualReturn = Number(pension.annualReturn || 7);
  const annualSalaryIncrease = Number(pension.annualSalaryIncrease || 2);
  const withdrawalRate = Number(pension.withdrawalRate || 4);

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currency = currencyLookup(e.target.value);
    setSelectedCurrency(currency);

    setPension(prev => ({
      ...prev,
      currencyCode: currency.code
    }));
  };

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

    const retirementSavings = totalSavings;

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
      totalSavings: Math.round(retirementSavings),
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
            onChange={handleCurrencyChange}
          />

          <CurrencyInput
            label="Current Age"
            name="currentAge"
            value={currentAge}
            onChange={handleChange}
            min={18}
            max={100}
          />

          <CurrencyInput
            label="Retirement Age"
            name="retirementAge"
            value={retirementAge}
            onChange={handleChange}
            min={currentAge + 1}
            max={100}
          />

          <CurrencyInput
            label={"Current Annual Salary (" + selectedCurrency.symbol + ")"}
            name="currentSalary"
            value={currentSalary}
            onChange={handleChange}
            min={0}
            step={1000}
          />

          <CurrencyInput
            label={"Current Savings / Pension Value (" + selectedCurrency.symbol + ")"}
            name="currentSavings"
            value={currentSavings}
            onChange={handleChange}
            min={0}
            step={1000}
          />

          <CurrencyInput
            label={"Monthly Contributions (" + selectedCurrency.symbol + ")"}
            name="monthlySavings"
            value={monthlySavings}
            onChange={handleChange}
            min={0}
          />

          <CurrencyInput
            label="Employer Match (%)"
            name="employerMatch"
            value={employerMatch}
            onChange={handleChange}
            min={0}
            max={100}
            step={0.1}
          />

          <CurrencyInput
            label="Expected Annual Return (%)"
            name="annualReturn"
            value={annualReturn}
            onChange={handleChange}
            min={0}
            max={20}
            step={0.1}
          />

          <CurrencyInput
            label="Annual Salary Increase (%)"
            name="annualSalaryIncrease"
            value={annualSalaryIncrease}
            onChange={handleChange}
            min={0}
            max={20}
            step={0.1}
          />

          <CurrencyInput
            label="Desired withdrawal rate (%)"
            name="withdrawalRate"
            value={withdrawalRate}
            onChange={handleChange}
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
