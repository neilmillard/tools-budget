'use client';
import React, {useState, useEffect, ChangeEvent, useCallback} from 'react';
import {CurrencyInput} from "@/app/components/ui/CurrencyInput";
import {SliderInput} from "@/app/components/ui/SliderInput";

// Main component
const MortgageOverpaymentCalculator: React.FC = () => {
  // Default values
  const [mortgageAmount, setMortgageAmount] = useState<number>(270000);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [termYears, setTermYears] = useState<number>(25);
  const [termMonths, setTermMonths] = useState<number>(0);
  const [monthlyOverpayment, setMonthlyOverpayment] = useState<number>(100);
  const [oneOffOverpayment, setOneOffOverpayment] = useState<number>(0);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [newTermMonths, setNewTermMonths] = useState<number>(0);
  const [interestSaved, setInterestSaved] = useState<number>(0);
  const [originalMonthlyPayment, setOriginalMonthlyPayment] = useState<number>(0);

  const currencyFormatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const getTotalTermMonths = useCallback(() => {
    return (termYears * 12) + termMonths;
  }, [termYears, termMonths]);

  // Calculate standard mortgage payments (without overpayments)
  useEffect(() => {
    const monthlyRate = interestRate / 100 / 12;

    const payments = getTotalTermMonths();

    // Calculate monthly payment
    if (monthlyRate === 0) {
      const payment = mortgageAmount / payments;
      setOriginalMonthlyPayment(payment);
    } else {
      const x = Math.pow(1 + monthlyRate, payments);
      const payment = (mortgageAmount * x * monthlyRate) / (x - 1);
      setOriginalMonthlyPayment(payment);
    }
  }, [mortgageAmount, interestRate, termYears, termMonths, getTotalTermMonths]);

  // Calculate with overpayments
  useEffect(() => {
    const monthlyRate = interestRate / 100 / 12;

    // Standard calculation for reference
    const payments = getTotalTermMonths();
    const standardTotalPaid = originalMonthlyPayment * payments;
    const standardTotalInterest = standardTotalPaid - mortgageAmount;

    // Calculate with overpayments
    let remainingLoan = mortgageAmount;
    let monthsPaid = 0;
    let totalInterestPaid = 0;
    let totalAmountPaid = 0;

    // Apply one-off overpayment at the beginning
    if (oneOffOverpayment > 0 && oneOffOverpayment < remainingLoan) {
      remainingLoan -= oneOffOverpayment;
      totalAmountPaid += oneOffOverpayment;
    }

    while (remainingLoan > 0) {
      // Calculate interest for this month
      const interestThisMonth = remainingLoan * monthlyRate;
      totalInterestPaid += interestThisMonth;

      // Regular payment plus overpayment
      const paymentThisMonth = Math.min(originalMonthlyPayment, remainingLoan + interestThisMonth);
      totalAmountPaid += paymentThisMonth;

      // Reduce remaining loan by payment minus interest
      remainingLoan -= (paymentThisMonth - interestThisMonth);

      // Add monthly overpayment if there's still a loan remaining
      if (remainingLoan > 0 && monthlyOverpayment > 0) {
        const actualOverpayment = Math.min(monthlyOverpayment, remainingLoan);
        remainingLoan -= actualOverpayment;
        totalAmountPaid += actualOverpayment;
      }

      monthsPaid++;

      // Safety check to prevent infinite loops
      if (monthsPaid > 1200) { // 100 years
        break;
      }
    }

    // Update state with calculated values
    setTotalPaid(totalAmountPaid);
    setTotalInterest(totalInterestPaid);
    setNewTermMonths(monthsPaid);
    setInterestSaved(standardTotalInterest - totalInterestPaid);
  }, [mortgageAmount, interestRate, termYears, termMonths, monthlyOverpayment, oneOffOverpayment, originalMonthlyPayment, getTotalTermMonths]);

  // Format term in years and months
  const formatTermYearsMonths = (totalMonths: number): string => {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  const calculateTimeSaved = (): number => {
    return getTotalTermMonths() - newTermMonths;
  }

  // Handle input changes
  const handleMortgageOutstandingChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value) || 0;
    setMortgageAmount(value);
  };

  const handleInterestRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value);
    setInterestRate(value);
  };

  const handleTermYearsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    setTermYears(value);
  };

  const handleTermMonthsChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value);
    setTermMonths(value);
  };

  const handleMonthlyOverpaymentChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value) || 0;
    setMonthlyOverpayment(value);
  };

  const handleOneOffOverpaymentChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseFloat(e.target.value) || 0;
    setOneOffOverpayment(value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Mortgage Overpayment Calculator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CurrencyInput
            label="Outstanding Mortgage"
            value={mortgageAmount}
            onChange={handleMortgageOutstandingChange}
            currencySymbol="£"
            step={1000}
          />

          <SliderInput
            label="Interest Rate"
            value={interestRate}
            onChange={handleInterestRateChange}
            min={0.1}
            max={10}
            step={0.01}
            unit="%"
          />

          <div className="space-y-2">
            <h3 className="font-medium">Mortgage Term</h3>
            <div className="grid grid-cols-2 gap-4">
              <SliderInput
                label="Years"
                value={termYears}
                onChange={handleTermYearsChange}
                min={0}
                max={40}
                step={1}
                unit=" years"
              />
              <SliderInput
                label="Months"
                value={termMonths}
                onChange={handleTermMonthsChange}
                min={0}
                max={11}
                step={1}
                unit=" months"
              />
            </div>
          </div>

          <CurrencyInput
            label="Monthly Overpayment"
            value={monthlyOverpayment}
            onChange={handleMonthlyOverpaymentChange}
            currencySymbol="£"
            step={10}
          />

          <CurrencyInput
            label="One-off Overpayment"
            value={oneOffOverpayment}
            onChange={handleOneOffOverpaymentChange}
            currencySymbol="£"
            step={1000}
          />
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Loan Details</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-gray-600">Mortgage Amount:</div>
                <div className="font-medium text-right">{currencyFormatter.format(mortgageAmount)}</div>
                <div className="text-gray-600">Standard Monthly Payment:</div>
                <div className="font-medium text-right">{currencyFormatter.format(originalMonthlyPayment)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700">With Overpayments</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-gray-600">New Term:</div>
                <div className="font-medium text-right">{formatTermYearsMonths(newTermMonths)}</div>
                <div className="text-gray-600">Total Paid:</div>
                <div className="font-medium text-right">{currencyFormatter.format(totalPaid)}</div>
                <div className="text-gray-600">Total Interest:</div>
                <div className="font-medium text-right">{currencyFormatter.format(totalInterest)}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-green-700">Savings</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-gray-600">Time Saved:</div>
                <div className="font-medium text-right">{formatTermYearsMonths(calculateTimeSaved())}</div>
                <div className="text-gray-600">Interest Saved:</div>
                <div className="font-medium text-right text-green-600">{currencyFormatter.format(interestSaved)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageOverpaymentCalculator;
