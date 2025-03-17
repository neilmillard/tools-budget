import React from 'react';

const FinancialSteps = () => {
    const steps = [
        { number: 1, title: "Paying Debt", color: "#ffaa66" },
        { number: 2, title: "Saving", color: "#f7dc6f" },
        { number: 3, title: "Buying a\nHome", color: "#c6e07f" },
        { number: 4, title: "Investing", color: "#a7e0a5" }
    ];

    return (
        <div className="w-full px-4 py-8">
            <div className="flex flex-wrap justify-between gap-4">
                {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center w-full sm:w-64">
                        {/* Circle with number */}
                        <div className="flex items-center justify-center w-16 h-16 mb-6 border-4 border-black rounded-full">
                            <span className="text-3xl font-bold">{step.number}</span>
                        </div>

                        {/* Colored box with title */}
                        <div
                            className="flex items-center justify-center w-full p-6 text-black shadow-md h-24"
                            style={{ backgroundColor: step.color }}
                        >
                            <h3 className="text-2xl font-semibold text-center whitespace-pre-line">{step.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FinancialSteps;
