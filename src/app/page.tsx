import Link from "next/link";
import FinancialSteps from "@/app/components/FinancialSteps";
import { Metadata } from "next";
import {ChevronRight} from "lucide-react";

export const metadata: Metadata = {
  title: "Helpful Money | Financial Tools to Manage Your Money Better",
  description: "Discover free financial tools including budget planner, mortgage calculator, pension calculator, and more to help you make smarter money decisions.",
  openGraph: {
    title: "Helpful Money | Financial Tools to Manage Your Money Better",
    description: "Discover free financial tools including budget planner, mortgage calculator, pension calculator, and more to help you make smarter money decisions.",
  },
};

export default function Home() {
  return (
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold">Helpful Money</h2>
        <p className="text-xl italic text-neutral-600 mt-2">Ancient wisdom. Modern tools.</p>
      </div>
      <h2 className="text-xl flex justify-center font-bold mb-4">Money Tools</h2>
      <div className="p-6">
        <p>Helpful Money, a collection of tools so you stay on track with your Money Journey.</p>
        <p>You want to live below your income and invest the rest. If you have loans or credit cards, pay these off
          before investing.</p>
        <p>“Investing should be more like watching paint dry or watching grass grow. If you want excitement, take $800 and go to Las Vegas.”
          ― Paul Samuelson</p>
        
        <div className="my-10 p-8 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-6xl font-serif text-amber-900 leading-none">“</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
              Ancient Wisdom for Modern Money
            </h3>
            <p className="text-lg text-amber-800 italic mb-4">
              "Timeless money wisdom, written 4,000 years ago — still true today"
            </p>
            <p className="text-gray-700 mb-6 max-w-2xl">
              Feeling overwhelmed by modern finance? Start with the <b>7 Cures for a Lean Purse</b>. 
              These ancient Babylonian parables are the perfect entry point for anyone starting their financial journey.
            </p>
            <Link 
              href="/babylon/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-all shadow hover:shadow-md"
            >
              Explore the Babylon Series <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>

        <FinancialSteps/>
        <p className="pt-6"><Link href={'/tools/budget/'}><b>Budget Planner</b></Link> enables you to fill in the form similar
          to a bank loan.
          This will help you understand where you think your money is going. To know for sure
          you will have to make a record.
          The main benefit this too will give you, is to understand if your &apos;spare&apos; cash is greater than 10%.
          Read about the <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                               href="/fiftythirtytwenty/">50-30-20</Link> budget guide.</p>
        <p className="pt-6"><Link href={'/tools/mortgage/'}><b>Mortgage Calculator</b></Link> is a fun tool to check how
          much the repayments will be on a mortgage, based on amount borrowed, interest rate and term.</p>
        <p className="pt-6"><Link href={'/tools/mortgage-overpayment-calculator/'}><b>Mortgage Overpayment Calculator</b></Link> will enable you to
          see how much overpayments can effect the term of your mortgage, based on lump sum or regular overpayments.</p>
        <p className="pt-6"><Link href={'/tools/afford/'}><b>Mortgage Affordability Calculator</b></Link> will help you
          calculate based on your earnings, how much mortgage you may get offered. If you enter the total
          outgoings from the Budget Planner, it can help you gauge if you can afford the repayments too.</p>
        <p className="pt-6"><Link href={'/tools/pension/'}><b>Pension Calculator</b></Link> will give you a rough guide of how
          much your pension pot could be when you retire. Playing with the Withdrawal Rate can help you understand how
          long the money will last.</p>
      </div>
      <div className="flex justify-center">
        <p className="pt-6 pb-6">If you would like to hear about a new budgeting app, here is a survey to help us build it for you.</p>
      </div>
      <div className="flex justify-center" data-tf-live="01JTDAGBS12DNVW9YS48YXE667"></div><script async src="//embed.typeform.com/next/embed.js"></script>
    </div>
  )
}
