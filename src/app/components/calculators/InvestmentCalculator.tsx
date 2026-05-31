'use client';

import React, {ChangeEvent, useEffect, useState} from 'react';
import {CurrencyInput} from "@/app/components/ui/CurrencyInput";
import {CurrencySelector, currencies, Currency, currencyLookup} from "@/app/components/ui/Currency";
import InvestmentChart, {DataPoint} from "@/app/components/ui/InvestmentChart";

type CalcMode = 'endAmount' | 'contribution' | 'returnRate' | 'startingAmount' | 'length';
type CompoundingFrequency = 'daily' | 'monthly' | 'yearly';
type ContributionTiming = 'beginning' | 'end';

interface InvestmentData {
  startingAmount: string;
  years: string;
  returnRate: string;
  compounding: CompoundingFrequency;
  additionalContribution: string;
  contributionFrequency: 'monthly' | 'yearly';
  contributionTiming: ContributionTiming;
  targetAmount: string;
  currencyCode: string;
}

interface BreakdownPoint {
  month: number;
  year: number;
  contribution: number;
  interest: number;
  balance: number;
  totalContributions: number;
}

interface Results {
  endAmount: number;
  totalContributions: number;
  totalInterest: number;
  requiredContribution?: number;
  requiredRate?: number;
  requiredStartingAmount?: number;
  requiredYears?: number;
  chartData: DataPoint[];
  monthlyBreakdown: BreakdownPoint[];
}

export default function InvestmentCalculator() {
  const [mode, setMode] = useState<CalcMode>('endAmount');
  const [data, setData] = useState<InvestmentData>({
    startingAmount: '10000',
    years: '10',
    returnRate: '7',
    compounding: 'monthly',
    additionalContribution: '500',
    contributionFrequency: 'monthly',
    contributionTiming: 'end',
    targetAmount: '100000',
    currencyCode: 'USD',
  });

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [results, setResults] = useState<Results | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodeData = params.get("data");
    if (encodeData) {
      try {
        const decodedData = JSON.parse(atob(encodeData));
        setData(prev => ({ ...prev, ...decodedData }));
        if (decodedData.currencyCode) {
          setSelectedCurrency(currencyLookup(decodedData.currencyCode));
        }
        if (decodedData.mode) {
          setMode(decodedData.mode);
        }
      } catch (error) {
        console.error("Failed to decode investment data", error);
      }
    }
  }, []);

  useEffect(() => {
    const encodedData = btoa(JSON.stringify({ ...data, mode }));
    window.history.replaceState({}, "", `?data=${encodedData}`);
  }, [data, mode]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currency = currencyLookup(e.target.value);
    setSelectedCurrency(currency);
    setData(prev => ({
      ...prev,
      currencyCode: currency.code
    }));
  };

  const calculate = () => {
    const P = Number(data.startingAmount);
    const t = Number(data.years);
    const r = Number(data.returnRate) / 100;
    const PMT = Number(data.additionalContribution);
    const target = Number(data.targetAmount);
    
    const nMap: Record<CompoundingFrequency, number> = {
      daily: 365,
      monthly: 12,
      yearly: 1
    };
    const n = nMap[data.compounding];
    
    // For simplicity in chart and contribution logic, we assume monthly contributions
    // or yearly contributions.
    const contribFreq = data.contributionFrequency === 'monthly' ? 12 : 1;
// Basic Future Value calculation for End Amount
    const calculateFV = (p: number, years: number, rate: number, pmt: number, freq: number) => {
      let currentVal = p;
      let totalContrib = p;
      const points: DataPoint[] = [{ year: 0, savings: Math.round(p) }];
      const breakdown: BreakdownPoint[] = [{
        month: 0,
        year: 0,
        contribution: 0,
        interest: 0,
        balance: p,
        totalContributions: p
      }];
      
      const totalMonths = Math.ceil(years * 12);
      
      // Determine periodic rate based on compounding
      // We'll use the effective monthly rate for the loop
      const monthlyRate = Math.pow(1 + rate/n, n/12) - 1;
      
      for (let i = 1; i <= totalMonths; i++) {
        let monthlyContrib = 0;

        // Add contribution if at beginning
        if (data.contributionTiming === 'beginning' && i % (12 / freq) === 0) {
          currentVal += pmt;
          monthlyContrib += pmt;
          totalContrib += pmt;
        }

        // Compound interest (monthly)
        const interest = currentVal * monthlyRate;
        currentVal += interest;
        
        // Add contribution if at end
        if (data.contributionTiming === 'end' && i % (12 / freq) === 0) {
          currentVal += pmt;
          monthlyContrib += pmt;
          totalContrib += pmt;
        }
        
        const yearNum = Math.floor((i - 1) / 12);
        const monthInYear = ((i - 1) % 12) + 1;

        breakdown.push({
          month: monthInYear,
          year: yearNum,
          contribution: monthlyContrib,
          interest: interest,
          balance: currentVal,
          totalContributions: totalContrib
        });

        if (i % 12 === 0) {
          points.push({ year: i / 12, savings: Math.round(currentVal) });
        }
      }
      
      // Handle non-integer years for 'length' mode
      if (totalMonths % 12 !== 0 && totalMonths > 0) {
        // points.push({ year: Number(years.toFixed(1)), savings: Math.round(currentVal) });
      }

      return { currentVal, totalContrib, points, breakdown };
    };

    const res = calculateFV(P, t, r, PMT, contribFreq);
    
    let finalResults: Results = {
      endAmount: res.currentVal,
      totalContributions: res.totalContrib,
      totalInterest: res.currentVal - res.totalContrib,
      chartData: res.points,
      monthlyBreakdown: res.breakdown
    };

    if (mode === 'contribution') {
      // Solve for PMT: FV = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)] * (1+r/n if beginning)
      // This is complex with mismatching compounding and contribution frequencies.
      // We'll use an iterative approach or simplified formula.
      // Simplified: PMT = (Target - P(1+r)^t) / [((1+r)^t - 1) / r]
      const ratePerPeriod = r / contribFreq;
      const numPeriods = t * contribFreq;
      const fvPrincipal = P * Math.pow(1 + r, t);
      const factor = (Math.pow(1 + ratePerPeriod, numPeriods) - 1) / ratePerPeriod;
      const timingFactor = data.contributionTiming === 'beginning' ? (1 + ratePerPeriod) : 1;
      
      const requiredPMT = (target - fvPrincipal) / (factor * timingFactor);
      finalResults.requiredContribution = requiredPMT;
      // Recalculate chart with required PMT
      const reRes = calculateFV(P, t, r, requiredPMT, contribFreq);
      finalResults.endAmount = reRes.currentVal;
      finalResults.totalContributions = reRes.totalContrib;
      finalResults.totalInterest = reRes.currentVal - reRes.totalContrib;
      finalResults.chartData = reRes.points;
      finalResults.monthlyBreakdown = reRes.breakdown;
    } else if (mode === 'returnRate') {
      // Binary search for rate
      let low = 0, high = 1;
      for(let i=0; i<20; i++) {
        let mid = (low + high) / 2;
        if (calculateFV(P, t, mid, PMT, contribFreq).currentVal < target) low = mid;
        else high = mid;
      }
      finalResults.requiredRate = high * 100;
      const reRes = calculateFV(P, t, high, PMT, contribFreq);
      finalResults.chartData = reRes.points;
      finalResults.endAmount = reRes.currentVal;
      finalResults.totalContributions = reRes.totalContrib;
      finalResults.totalInterest = reRes.currentVal - reRes.totalContrib;
      finalResults.monthlyBreakdown = reRes.breakdown;
    } else if (mode === 'startingAmount') {
      // P = (Target - PMT * factor) / (1+r)^t
      const ratePerPeriod = r / contribFreq;
      const numPeriods = t * contribFreq;
      const factor = (Math.pow(1 + ratePerPeriod, numPeriods) - 1) / ratePerPeriod;
      const timingFactor = data.contributionTiming === 'beginning' ? (1 + ratePerPeriod) : 1;
      const requiredP = (target - (PMT * factor * timingFactor)) / Math.pow(1 + r, t);
      finalResults.requiredStartingAmount = Math.max(0, requiredP);
      const reRes = calculateFV(finalResults.requiredStartingAmount, t, r, PMT, contribFreq);
      finalResults.chartData = reRes.points;
      finalResults.endAmount = reRes.currentVal;
      finalResults.totalContributions = reRes.totalContrib;
      finalResults.totalInterest = reRes.currentVal - reRes.totalContrib;
      finalResults.monthlyBreakdown = reRes.breakdown;
    } else if (mode === 'length') {
      // Binary search for years
      let low = 0, high = 100;
      for(let i=0; i<20; i++) {
        let mid = (low + high) / 2;
        if (calculateFV(P, mid, r, PMT, contribFreq).currentVal < target) low = mid;
        else high = mid;
      }
      finalResults.requiredYears = high;
      const reRes = calculateFV(P, high, r, PMT, contribFreq);
      finalResults.chartData = reRes.points;
      finalResults.endAmount = reRes.currentVal;
      finalResults.totalContributions = reRes.totalContrib;
      finalResults.totalInterest = reRes.currentVal - reRes.totalContrib;
      finalResults.monthlyBreakdown = reRes.breakdown;
    }

    setResults(finalResults);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-50 rounded-lg">
        {[
          { id: 'endAmount', label: 'End Amount' },
          { id: 'contribution', label: 'Contribution' },
          { id: 'returnRate', label: 'Return Rate' },
          { id: 'startingAmount', label: 'Starting Amount' },
          { id: 'length', label: 'Length' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setMode(tab.id as CalcMode); setResults(null); }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === tab.id 
                ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <CurrencySelector selectedCurrency={selectedCurrency} onChange={handleCurrencyChange} />
          
          {mode !== 'startingAmount' && (
            <CurrencyInput
              label="Starting Amount"
              name="startingAmount"
              value={Number(data.startingAmount)}
              onChange={handleChange}
              currencySymbol={selectedCurrency.symbol}
            />
          )}

          {mode !== 'length' && (
            <div>
              <label className="block text-sm font-medium mb-1">Duration (Years)</label>
              <input
                type="number"
                name="years"
                value={data.years}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          {mode !== 'returnRate' && (
            <div>
              <label className="block text-sm font-medium mb-1">Expected Return Rate (%)</label>
              <input
                type="number"
                name="returnRate"
                value={data.returnRate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                step="0.1"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Compounding</label>
              <select
                name="compounding"
                value={data.compounding}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contrib. Timing</label>
              <select
                name="contributionTiming"
                value={data.contributionTiming}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="beginning">Beginning</option>
                <option value="end">End</option>
              </select>
            </div>
          </div>

          {mode !== 'contribution' && (
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput
                label="Additional Contribution"
                name="additionalContribution"
                value={Number(data.additionalContribution)}
                onChange={handleChange}
                currencySymbol={selectedCurrency.symbol}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Frequency</label>
                <select
                  name="contributionFrequency"
                  value={data.contributionFrequency}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          )}

          {mode !== 'endAmount' && (
            <CurrencyInput
              label="Target Amount"
              name="targetAmount"
              value={Number(data.targetAmount)}
              onChange={handleChange}
              currencySymbol={selectedCurrency.symbol}
            />
          )}

          <button
            onClick={calculate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md mt-6"
          >
            Calculate
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Results</h3>
          
          {results ? (
            <div className="space-y-6 grow">
              <div className="grid grid-cols-1 gap-4">
                {mode === 'contribution' && (
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Required Monthly Contribution</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedCurrency.symbol}{results.requiredContribution?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {mode === 'returnRate' && (
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Required Annual Return Rate</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {results.requiredRate?.toFixed(2)}%
                    </p>
                  </div>
                )}
                {mode === 'startingAmount' && (
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Required Starting Amount</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedCurrency.symbol}{results.requiredStartingAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                {mode === 'length' && (
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">Required Time</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {results.requiredYears?.toFixed(1)} Years
                    </p>
                  </div>
                )}
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-500">End Balance</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedCurrency.symbol}{results.endAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Total Contrib.</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedCurrency.symbol}{results.totalContributions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Total Interest</p>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedCurrency.symbol}{results.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-64 mt-auto">
                <InvestmentChart 
                  chart={results.chartData} 
                  label={`Growth over ${results.chartData[results.chartData.length - 1].year} years`}
                  responsive={true}
                />
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-blue-600 font-semibold flex items-center hover:text-blue-800 transition-colors"
                >
                  {showBreakdown ? 'Hide' : 'Show'} Month-by-Month Breakdown
                  <span className={`ml-2 transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {showBreakdown && (
                  <div className="mt-4 overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                          <th className="px-4 py-2 border-b">Month</th>
                          <th className="px-4 py-2 border-b">Contribution</th>
                          <th className="px-4 py-2 border-b">Interest</th>
                          <th className="px-4 py-2 border-b">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.monthlyBreakdown.map((row, idx) => (
                          <tr key={idx} className={row.month === 0 ? 'bg-gray-50' : ''}>
                            <td className="px-4 py-2">
                              {row.month === 0 ? 'Start' : `Yr ${row.year + 1}, Mo ${row.month}`}
                            </td>
                            <td className="px-4 py-2">
                              {row.month === 0 ? '-' : `${selectedCurrency.symbol}${row.contribution.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </td>
                            <td className="px-4 py-2">
                              {row.month === 0 ? '-' : `${selectedCurrency.symbol}${row.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </td>
                            <td className="px-4 py-2 font-medium">
                              {selectedCurrency.symbol}{row.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center grow text-gray-400 space-y-2 py-12">
              <span className="text-4xl">📊</span>
              <p>Enter your details and click calculate to see your results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
