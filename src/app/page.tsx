import Link from "next/link";
import FinancialSteps from "@/app/components/FinancialSteps";

export default function Home() {
    return (
        <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4">Money Tools</h2>
            <div>
            <button className={"p-2 rounded border border-black shadow-lg bg-blue-500 text-white hover:bg-blue-700"}>
                <Link href="/budget/">Budget Planner</Link>
            </button>
            <button className={"ml-4 p-2 rounded border-black shadow-lg bg-blue-500 text-white hover:bg-blue-700"}>
                <Link href="/mortgage/">Mortgage Calculator</Link>
            </button>
            <button className={"ml-4 p-2 rounded border-black shadow-lg bg-blue-500 text-white hover:bg-blue-700"}>
                <Link href="/afford/">Mortgage Affordability Calculator</Link>
            </button>
            </div>
            <div className="p-6">
                <p>Helpful Money, a collection of tools so you stay on track with your Money Journey.</p>
                <p className="pt-6"><b>Budget Planner</b> enables you to fill in the form similar to a bank loan.
                This will help you understand where you think your money is going. To know for sure
                you will have to make a record.
                The main benefit this too will give you, is to understand if your &apos;spare&apos; cash is 20%.
                Read about the <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="/fiftythirtytwenty/">50-30-20</Link> budget guide.</p>
                <p className="pt-6"><b>Mortgage Calculator</b> is a fun tool to check how much the repayments will be on a mortgage,
                based on amount borrowed, interest rate and term.</p>
                <p className="pt-6"><b>Mortgage Affordability Calculator</b> will help you calculate based on your earnings, how much mortgage you
                may get offered. If you enter the total outgoings from the Budget Planner, it can help you gauge if
                you can afford the repayments too.</p>
            </div>
            <FinancialSteps/>
        </div>
    )
}
