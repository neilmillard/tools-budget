
'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, DollarSign, BarChart3, Building2, Eye, EyeOff, Edit3, RotateCcw } from 'lucide-react';

const DcfAnalysis = () => {
    const [showCalculations, setShowCalculations] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Default values
    const defaultValues = {
        company: "Apple Inc. (AAPL)",
        currentYear: 2024,
        currentStock: 175,
        freeCashFlows: [95000, 102000, 109000, 116000, 124000], // in millions
        discountRate: 9.5, // WACC
        terminalGrowthRate: 2.5,
        sharesOutstanding: 15700 // in millions
    };

    const [dcfParams, setDcfParams] = useState(defaultValues);

    const resetToDefaults = () => {
        setDcfParams(defaultValues);
    };

    const handleInputChange = (field: string, value: string | number, index?: number) => {
        if (field === 'freeCashFlows' && index !== undefined) {
            const newFlows = [...dcfParams.freeCashFlows];
            newFlows[index] = typeof value === 'string' ? parseFloat(value) || 0 : value;
            setDcfParams(prev => ({ ...prev, freeCashFlows: newFlows }));
        } else {
            setDcfParams(prev => ({ 
                ...prev, 
                [field]: typeof value === 'string' ? parseFloat(value) || 0 : value 
            }));
        }
    };

    const calculatePresentValue = (cashFlow: number, rate: number, year: number) => {
        return cashFlow / Math.pow(1 + rate/100, year);
    };

    const calculateTerminalValue = () => {
        const finalCashFlow = dcfParams.freeCashFlows[4];
        const terminalCashFlow = finalCashFlow * (1 + dcfParams.terminalGrowthRate/100);
        return terminalCashFlow / (dcfParams.discountRate/100 - dcfParams.terminalGrowthRate/100);
    };

    const terminalValue = calculateTerminalValue();
    const presentValueOfTerminal = calculatePresentValue(terminalValue, dcfParams.discountRate, 5);
    
    const presentValues = dcfParams.freeCashFlows.map((cf, index) => 
        calculatePresentValue(cf, dcfParams.discountRate, index + 1)
    );
    
    const sumOfProjectedCashFlows = presentValues.reduce((sum, pv) => sum + pv, 0);
    const totalPresentValue = sumOfProjectedCashFlows + presentValueOfTerminal;
    const fairValuePerShare = totalPresentValue / dcfParams.sharesOutstanding;
    const projectedCashFlowValuePerShare = sumOfProjectedCashFlows / dcfParams.sharesOutstanding;
    const terminalValuePerShare = presentValueOfTerminal / dcfParams.sharesOutstanding;
    const upside = ((fairValuePerShare - dcfParams.currentStock) / dcfParams.currentStock) * 100;

    // Calculate growth rates for display
    const growthRates = dcfParams.freeCashFlows.map((cf, index) => {
        if (index === 0) return 0; // Base year
        return ((cf - dcfParams.freeCashFlows[index - 1]) / dcfParams.freeCashFlows[index - 1]) * 100;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-[90%] max-w-6xl mx-auto py-12">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Discounted Cash Flow Analysis</h1>
                            <p className="text-xl text-gray-600 mt-2">Master the art of stock valuation through future cash flow projections</p>
                        </div>
                    </div>
                </div>

                {/* Introduction Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <TrendingUp className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is DCF Analysis?</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                Discounted Cash Flow (DCF) analysis is a valuation method used to estimate 
                                the value of an investment based on its expected future cash flows. It helps 
                                investors determine whether a stock is overvalued or undervalued by calculating 
                                the present value of projected future cash flows.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive DCF Calculator */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-green-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Interactive DCF Calculator: {dcfParams.company}</h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    editMode 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                <Edit3 className="w-4 h-4" />
                                {editMode ? 'Lock Values' : 'Edit Values'}
                            </button>
                            <button
                                onClick={resetToDefaults}
                                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 mb-6">
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">${dcfParams.currentStock}</div>
                                <div className="text-sm text-gray-600">Current Stock Price</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">${fairValuePerShare.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">DCF Fair Value</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {upside > 0 ? '+' : ''}{upside.toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">Potential Upside/Downside</div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            {editMode ? '✏️ Edit the values below to see how they affect the valuation' : '*Click "Edit Values" to modify the assumptions'}
                        </div>
                    </div>

                    {/* Editable Parameters */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Basic Parameters */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Basic Parameters</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={dcfParams.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{dcfParams.company}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock Price ($)</label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        value={dcfParams.currentStock}
                                        onChange={(e) => handleInputChange('currentStock', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">${dcfParams.currentStock}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Shares Outstanding (Millions)</label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        value={dcfParams.sharesOutstanding}
                                        onChange={(e) => handleInputChange('sharesOutstanding', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{dcfParams.sharesOutstanding.toLocaleString()}M</div>
                                )}
                            </div>
                        </div>

                        {/* Valuation Parameters */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Valuation Parameters</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate / WACC (%)</label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={dcfParams.discountRate}
                                        onChange={(e) => handleInputChange('discountRate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{dcfParams.discountRate}%</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Terminal Growth Rate (%)</label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={dcfParams.terminalGrowthRate}
                                        onChange={(e) => handleInputChange('terminalGrowthRate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                ) : (
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{dcfParams.terminalGrowthRate}%</div>
                                )}
                            </div>

                            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                <strong>Tip:</strong> WACC typically ranges from 8-12% for most companies. Terminal growth should be conservative (2-4%).
                            </div>
                        </div>
                    </div>

                    {/* Cash Flow Projections */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Year Free Cash Flow Projections</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Year</th>
                                        <th className="border border-gray-300 px-4 py-2">Free Cash Flow ($M)</th>
                                        <th className="border border-gray-300 px-4 py-2">Growth Rate</th>
                                        <th className="border border-gray-300 px-4 py-2">Present Value ($M)</th>
                                        <th className="border border-gray-300 px-4 py-2">Value Per Share ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dcfParams.freeCashFlows.map((cf, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold">
                                                {dcfParams.currentYear + index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        value={cf}
                                                        onChange={(e) => handleInputChange('freeCashFlows', e.target.value, index)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                ) : (
                                                    `$${cf.toLocaleString()}`
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {index === 0 ? 'Base' : `${growthRates[index].toFixed(1)}%`}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold text-green-600">
                                                ${presentValues[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 font-semibold text-green-600">
                                                ${(presentValues[index] / dcfParams.sharesOutstanding).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {/* Subtotal Row for Projected Cash Flows */}
                                    <tr className="bg-green-50 font-semibold border-t-2 border-green-200">
                                        <td className="border border-gray-300 px-4 py-2 text-green-800">5-Year Total</td>
                                        <td className="border border-gray-300 px-4 py-2 text-green-800">-</td>
                                        <td className="border border-gray-300 px-4 py-2 text-green-800">-</td>
                                        <td className="border border-gray-300 px-4 py-2 text-green-700">
                                            ${sumOfProjectedCashFlows.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-green-700">
                                            ${projectedCashFlowValuePerShare.toFixed(2)}
                                        </td>
                                    </tr>
                                    
                                    {/* Terminal Value Row */}
                                    <tr className="bg-blue-50 font-semibold">
                                        <td className="border border-gray-300 px-4 py-2">Terminal Value</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            ${terminalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{dcfParams.terminalGrowthRate}%</td>
                                        <td className="border border-gray-300 px-4 py-2 text-blue-700">
                                            ${presentValueOfTerminal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-blue-700">
                                            ${terminalValuePerShare.toFixed(2)}
                                        </td>
                                    </tr>
                                    
                                    {/* Total Enterprise Value Row */}
                                    <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">TOTAL DCF VALUE</td>
                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">-</td>
                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">-</td>
                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                            ${totalPresentValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-gray-800">
                                            ${fairValuePerShare.toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Value Composition Summary */}
                        <div className="mt-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Value Composition:</h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-green-700 font-semibold">5-Year Cash Flows:</span> ${projectedCashFlowValuePerShare.toFixed(2)}/share ({((projectedCashFlowValuePerShare/fairValuePerShare)*100).toFixed(1)}% of total value)
                                </div>
                                <div>
                                    <span className="text-blue-700 font-semibold">Terminal Value:</span> ${terminalValuePerShare.toFixed(2)}/share ({((terminalValuePerShare/fairValuePerShare)*100).toFixed(1)}% of total value)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calculation Toggle */}
                    <div className="border-t pt-6">
                        <button
                            onClick={() => setShowCalculations(!showCalculations)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {showCalculations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showCalculations ? 'Hide' : 'Show'} Detailed Calculations
                        </button>

                        {showCalculations && (
                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold mb-3">Step-by-Step Calculation:</h4>
                                <div className="space-y-2 text-sm font-mono">
                                    <div>1. Present Value of Projected Cash Flows:</div>
                                    {dcfParams.freeCashFlows.map((cf, index) => (
                                        <div key={index} className="ml-4 text-gray-700">
                                            Year {index + 1}: ${cf.toLocaleString()}M ÷ (1.{(dcfParams.discountRate/100).toFixed(3).substring(2)})^{index + 1} = ${presentValues[index].toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M
                                        </div>
                                    ))}
                                    <div className="ml-4 text-blue-600 font-semibold">
                                        Subtotal PV of Projected Cash Flows: ${sumOfProjectedCashFlows.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M
                                    </div>
                                    
                                    <div className="mt-2">2. Terminal Value Calculation:</div>
                                    <div className="ml-4 text-gray-700">
                                        Terminal FCF: ${dcfParams.freeCashFlows[4].toLocaleString()}M × {(1 + dcfParams.terminalGrowthRate/100).toFixed(3)} = ${(dcfParams.freeCashFlows[4] * (1 + dcfParams.terminalGrowthRate/100)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M
                                    </div>
                                    <div className="ml-4 text-gray-700">
                                        Terminal Value: ${(dcfParams.freeCashFlows[4] * (1 + dcfParams.terminalGrowthRate/100)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M ÷ ({dcfParams.discountRate}% - {dcfParams.terminalGrowthRate}%) = ${terminalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M
                                    </div>
                                    <div className="ml-4 text-gray-700">
                                        PV of Terminal: ${terminalValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M ÷ (1.{(dcfParams.discountRate/100).toFixed(3).substring(2)})^5 = ${presentValueOfTerminal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M
                                    </div>
                                    
                                    <div className="mt-2 font-semibold">3. Total Enterprise Value:</div>
                                    <div className="ml-4 text-gray-700">
                                        ${sumOfProjectedCashFlows.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M + ${presentValueOfTerminal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M = ${totalPresentValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M
                                    </div>
                                    
                                    <div className="mt-2 font-semibold">4. Fair Value Per Share:</div>
                                    <div className="ml-4 text-gray-700">
                                        ${totalPresentValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M ÷ {dcfParams.sharesOutstanding.toLocaleString()}M shares = ${fairValuePerShare.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Investment Interpretation */}
                    <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-900 mb-2">Investment Interpretation:</h4>
                        <p className="text-amber-800 text-sm">
                            {upside > 20 ? (
                                `Based on this DCF analysis, the stock appears to be undervalued by ${Math.abs(upside).toFixed(1)}%, suggesting a potential buying opportunity. However, remember that DCF is highly sensitive to assumptions.`
                            ) : upside < -20 ? (
                                `The analysis suggests the stock may be overvalued by ${Math.abs(upside).toFixed(1)}%. Consider waiting for a better entry point or reviewing your assumptions.`
                            ) : (
                                `The stock appears to be fairly valued, with only ${Math.abs(upside).toFixed(1)}% ${upside > 0 ? 'upside' : 'downside'}. This suggests the market has efficiently priced the stock.`
                            )}
                        </p>
                    </div>
                </div>

                {/* Key Components Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                            <h3 className="text-xl font-bold text-gray-900">Key Components</h3>
                        </div>
                        <ul className="space-y-3">
                            {[
                                'Free Cash Flow (FCF) projections',
                                'Growth rate assumptions',
                                'Discount rate (WACC)',
                                'Terminal value calculation'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-bold text-gray-900">The DCF Formula</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                            <p className="font-mono text-sm text-gray-800 mb-2">
                                Present Value = CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CF𝑛/(1+r)ⁿ
                            </p>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p><strong>CF</strong> = Cash Flow for the period</p>
                                <p><strong>r</strong> = Discount rate</p>
                                <p><strong>n</strong> = Number of periods</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Step-by-Step Process */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">5 Steps to DCF Analysis</h2>
                    <div className="space-y-6">
                        {[
                            {
                                step: 1,
                                title: "Forecast Future Cash Flows",
                                description: "Project the company's free cash flows for the next 5-10 years",
                                color: "bg-blue-500"
                            },
                            {
                                step: 2,
                                title: "Determine the Discount Rate",
                                description: "Calculate the WACC or required rate of return",
                                color: "bg-green-500"
                            },
                            {
                                step: 3,
                                title: "Calculate Terminal Value",
                                description: "Estimate the business's value beyond the forecast period",
                                color: "bg-purple-500"
                            },
                            {
                                step: 4,
                                title: "Discount to Present Value",
                                description: "Convert all future cash flows to present value",
                                color: "bg-orange-500"
                            },
                            {
                                step: 5,
                                title: "Calculate Fair Value",
                                description: "Sum up the present values and divide by shares outstanding",
                                color: "bg-red-500"
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className={`${item.color} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0`}>
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Limitations Warning */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                        <div>
                            <h2 className="text-2xl font-bold text-amber-900 mb-4">Important Limitations</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Highly sensitive to input assumptions",
                                    "Difficult to accurately predict future cash flows",
                                    "May not account for qualitative factors",
                                    "Complex for companies with irregular cash flows"
                                ].map((limitation, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                                        <span className="text-amber-800">{limitation}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Best Practices */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pro Tips for Better DCF Analysis</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                tip: "Use Conservative Estimates",
                                description: "Better to underestimate than overestimate growth rates",
                                icon: "🎯"
                            },
                            {
                                tip: "Multiple Scenarios",
                                description: "Create best case, worst case, and base case scenarios",
                                icon: "📊"
                            },
                            {
                                tip: "Regular Updates",
                                description: "Update your analysis as new information becomes available",
                                icon: "🔄"
                            },
                            {
                                tip: "Cross-Validation",
                                description: "Compare results with other valuation methods",
                                icon: "✅"
                            },
                            {
                                tip: "Industry Context",
                                description: "Consider industry-specific factors and cycles",
                                icon: "🏭"
                            },
                            {
                                tip: "Margin of Safety",
                                description: "Always require a significant discount to fair value",
                                icon: "🛡️"
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                <div className="text-2xl mb-2">{item.icon}</div>
                                <h3 className="font-semibold text-gray-900 mb-2">{item.tip}</h3>
                                <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mt-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your DCF Analysis?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Remember, DCF analysis is as much art as it is science. Practice with different companies 
                        and scenarios to develop your valuation skills.
                    </p>
                    <div className="text-sm text-blue-200">
                        &#34;Price is what you pay. Value is what you get.&#34; - Warren Buffett
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DcfAnalysis;