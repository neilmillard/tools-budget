// Props interface for ResultsPanel
import {Component} from "react";

interface ResultsPanelProps {
    mortgageAmount: number;
    monthlyPayment: number;
    totalPaid: number;
    totalInterest: number;
    term: number;
    propertyPrice: number;
}

// ResultsPanel as a class component
export class ResultsPanel extends Component<ResultsPanelProps> {
    // Format currency
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    render() {
        const { mortgageAmount, monthlyPayment, totalPaid, totalInterest, term, propertyPrice } = this.props;

        return (
            <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Your Results</h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600">Mortgage amount</p>
                        <p className="text-xl font-bold">{this.formatCurrency(mortgageAmount)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">Monthly payment</p>
                        <p className="text-2xl font-bold text-blue-600">{this.formatCurrency(monthlyPayment)}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">Total paid over {term} years</p>
                        <p className="text-lg font-semibold">{this.formatCurrency(totalPaid)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">Total interest paid</p>
                        <p className="text-lg font-semibold">{this.formatCurrency(totalInterest)}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600">Loan to Value (LTV)</p>
                        <p className="text-lg font-semibold">
                            {propertyPrice > 0 ? ((mortgageAmount / propertyPrice) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
