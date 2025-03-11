import {Component} from "react";

export class ProgressSummary extends Component<{ totalIncome: number, totalExpenses: number }> {
    render() {
        return <div className="flex flex-col  print:border-none border border-slate-400 rounded-[4px] px-1 pb-4 ">
            <div
                className="flex md:flex-col lg:flex-row print:text-left print:p-2 text-center px-1 py-4 justify-center items-center">
                <h3 className="text-2xl text-gray-800 font-bold">Your progress</h3><span
                className="ml-1 text-lg">(monthly)</span></div>
            <table className="w-full border-collapse">
                <thead className="sr-only">
                <tr>
                    <th className="hidden"></th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody className="flex flex-col mx-1">
                <tr
                    className="flex justify-between print:border-none border w-full h-full rounded-[4px] mb-2 py-5 px-4 bg-gray-100">
                    <th className="text-lg font-normal">Income</th>
                    <td data-testid="income" className="text-md"><b>£{this.props.totalIncome.toFixed(2)}</b></td>
                </tr>
                <tr
                    className="flex justify-between print:border-none border w-full h-full rounded-[4px] mb-2 py-5 px-4 bg-gray-100">
                    <th className="text-lg font-normal">Spending</th>
                    <td data-testid="expenses" className="text-md"><b>£{this.props.totalExpenses.toFixed(2)}</b></td>
                </tr>
                <tr
                    className="flex justify-between print:border-none border w-full h-full rounded-[4px] mb-2 py-5 px-4 bg-green-700 text-white">
                    <th className="text-lg font-normal">Spare cash</th>
                    <td data-testid="spare" className="text-md"><b>£{(this.props.totalIncome - this.props.totalExpenses).toFixed(2)}</b>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>;
    }
}