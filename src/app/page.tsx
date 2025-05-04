import Link from "next/link";
import FinancialSteps from "@/app/components/FinancialSteps";

export default function Home() {
  return (
    <div className="w-[83%] mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl flex justify-center font-bold mb-4">Money Tools</h2>
      <div className="p-6">
        <p>Helpful Money, a collection of tools so you stay on track with your Money Journey.</p>
        <p>You want to live below your income and invest the rest. If you have loans or credit cards, pay these off
          before investing.</p>
        <FinancialSteps/>
        <p className="pt-6"><Link href={'/budget/'}><b>Budget Planner</b></Link> enables you to fill in the form similar
          to a bank loan.
          This will help you understand where you think your money is going. To know for sure
          you will have to make a record.
          The main benefit this too will give you, is to understand if your &apos;spare&apos; cash is greater than 10%.
          Read about the <Link className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                               href="/fiftythirtytwenty/">50-30-20</Link> budget guide.</p>
        <p className="pt-6"><Link href={'/mortgage/'}><b>Mortgage Calculator</b></Link> is a fun tool to check how
          much the repayments will be on a mortgage, based on amount borrowed, interest rate and term.</p>
        <p className="pt-6"><Link href={'/mortgage-overpayment-calculator/'}><b>Mortgage Overpayment Calculator</b></Link> will enable you to
          see how much overpayments can effect the term of your mortgage, based on lump sum or regular overpayments.</p>
        <p className="pt-6"><Link href={'afford'}><b>Mortgage Affordability Calculator</b></Link> will help you
          calculate based on your earnings, how much mortgage you may get offered. If you enter the total
          outgoings from the Budget Planner, it can help you gauge if you can afford the repayments too.</p>
        <p className="pt-6"><Link href={'/pension/'}><b>Pension Calculator</b></Link> will give you a rough guide of how
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
