'use client';
import {ChangeEvent, useEffect, useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {ProgressSummary} from "@/app/components/calculators/progressSummary";
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetCategories {
  [key: string]: { [key: string]: string };
}

export default function BudgetPlanner() {
  const [tab, setTab] = useState("income");
  const [budget, setBudget] = useState<BudgetCategories>({
    income: { salary: "", partnerSalary: "", benefits: "", pension: "", other: "" },
    bills: { rent: "", electricity: "", gas: "", water: "", councilTax: "", internet: "", tvLicense: "" },
    living: { groceries: "", clothing: "", householdItems: "" },
    finance: { insurance: "", loans: "", creditCards: "" },
    family: { childcare: "", schoolFees: "", petCosts: "" },
    travel: { fuel: "", publicTransport: "", parking: "" },
    leisure: { diningOut: "", entertainment: "", holidays: "" },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodeData = params.get("data")
    if (encodeData) {
      try {
        const decodedData = JSON.parse(atob(encodeData));
        setBudget(decodedData);
      } catch (error) {
        console.error("Failed to decode budget data", error);
      }
    }
  }, []);

  useEffect(() => {
    const encodedData = btoa(JSON.stringify(budget));
    window.history.replaceState({}, "", `?data=${encodedData}`);
  }, [budget]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, category: string) => {

    setBudget((prev) => ({
      ...prev,
      [category]: { ...prev[category], [e.target.name]: e.target.value },
    }));
  };

  const categoryTotals = Object.fromEntries(
      Object.entries(budget).map(([key, values]) => [
        key,
        Object.values(values).reduce((sum, val) => sum + (parseFloat(val) || 0), 0),
      ])
  );

  const totalIncome = categoryTotals.income;
  const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0) - totalIncome;

  const data = {
    labels: Object.keys(categoryTotals).filter((key) => key !== "income"),
    datasets: [{
      data: Object.entries(categoryTotals)
        .filter(([key]) => key !== "income")
        .map(([, value]) => value),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
    }]
  };

  return (
      <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
        <h2 className="text-xl font-bold mb-4">Budget Planner</h2>
        <p className="pl-6 pr-6">
          This calculator will tell you how much you have left over.
          If you are following the 50/30/20 rule, this left over cash
          should be 20%. Find out more <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/fiftythirtytwenty">50-30-20</Link>.
        </p>
        <p className="pl-6 pr-6 pb-6">You can save your progress by copying the whole URL in the address bar.
        </p>
        <div className="flex space-x-2 mb-4 overflow-auto">
          {Object.keys(budget).concat("summary").map((section) => (
              <button key={section}
                      className={`p-2 rounded ${tab === section ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      onClick={() => setTab(section)}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
          ))}
        </div>
        <div className="flex flex-row flex-wrap">
          <div className="w-full pb-4 pr-6 md:w-2/3">
            {tab !== "summary" && (
                <form className="space-y-4">{Object.keys(budget[tab]).map(key => (
                    <div key={key}>
                      <label className="block text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}
                        <input type="number" name={key} value={budget[tab][key]}
                               onChange={(e) => handleChange(e, tab)}
                               className="flex w-[43%] p-2 border rounded" placeholder="£0"/>
                      </label>
                    </div>
                ))}</form>
            )}

            {tab === "summary" && (
                <div className="flex flex-row flex-wrap mt-4 p-3 bg-gray-100 rounded">
                  <div className="w-3/12">
                    <ul className="mt-4">
                      {Object.entries(categoryTotals).map(([key, value]) => (
                          key !== "income" && (
                              <li key={key} className="text-gray-700 flex justify-between">
                                <span className="w-40 inline-block">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <span>£{value.toFixed(0)}</span>
                              </li>
                          )
                      ))}
                    </ul>
                  </div>
                  <div className="w-8/12">
                    <Doughnut data={data}/>
                  </div>
                </div>
            )}
          </div>
          <div className="w-full pb-4 md:w-1/3">
            <ProgressSummary totalIncome={totalIncome} totalExpenses={totalExpenses}/>
          </div>
        </div>
      </div>
  );
}
