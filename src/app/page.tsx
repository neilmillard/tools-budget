'use client';
import {ChangeEvent, useEffect, useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {ProgressSummary} from "@/app/components/progressSummary";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetPlanner() {
  const [tab, setTab] = useState("income");
  const [budget, setBudget] = useState({
    income: {},
    bills: {},
    living: {},
    finance: {},
    family: {},
    travel: {},
    leisure: {},
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const extractValues = (keys: any[]) =>
        keys.reduce((acc, key) => {
          acc[key] = params.get(key) || "";
          return acc;
        }, {});

    setBudget({
      income: extractValues(["salary", "partnerSalary", "benefits", "pension", "other"]),
      bills: extractValues(["rent", "electricity", "gas", "water", "councilTax", "internet", "tvLicense"]),
      living: extractValues(["groceries", "clothing", "householdItems"]),
      finance: extractValues(["insurance", "loans", "creditCards"]),
      family: extractValues(["childcare", "schoolFees", "petCosts"]),
      travel: extractValues(["fuel", "publicTransport", "parking"]),
      leisure: extractValues(["diningOut", "entertainment", "holidays"]),
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(budget).forEach(([, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        if (value) if (typeof value === "string") {
          params.set(key, value);
        }
      });
    });
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [budget]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, category: string) => {

    // @ts-ignore
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
  // @ts-ignore
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
          <div className="w-full pb-4 md:w-2/3">
            {tab !== "summary" && (
                <form className="space-y-4">{Object.keys(budget[tab]).map(key => (
                    <div key={key}>
                      <label className="block text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input type="number" name={key} value={budget[tab][key]}
                             onChange={(e) => handleChange(e, tab)}
                             className="flex w-[43%] p-2 border rounded" placeholder="£0"/>
                    </div>
                ))}</form>
            )}

            {tab === "summary" && (
                <div className="flex flex-row flex-wrap mt-4 p-3 bg-gray-100 rounded">
                  <div className="w-3/12">
                    <ul className="mt-4">
                      {Object.entries(categoryTotals).map(([key, value]) => (
                          key !== "income" && <li key={key} className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}: £{value.toFixed(2)}</li>
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
