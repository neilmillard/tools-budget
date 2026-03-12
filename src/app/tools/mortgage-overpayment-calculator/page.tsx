import MortgageOverpaymentCalculator from "@/app/components/calculators/MortgageOverpaymentCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Mortgage Overpayment Calculator | Helpful Money",
  description: "Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term.",
  openGraph: {
    title: "Mortgage Overpayment Calculator | Helpful Money",
    description: "Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term.",
  },
  alternates: {
    canonical: "/tools/mortgage-overpayment-calculator/",
  },
};

export default function Mortgage() {
  const relatedPosts = [
    { title: "How Much Could You Save by Overpaying Your Mortgage?", url: "/blog/how-much-save-mortgage-overpayment" },
    { title: "Freedom Through Discipline: Eliminating Consumer Debt", url: "/blog/freedom-through-discipline" }
  ];

  return (
    <>
      <SoftwareApplicationSchema 
        name="Mortgage Overpayment Calculator"
        description="Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term."
        url="https://www.helpfulmoney.site/tools/mortgage-overpayment-calculator/"
        applicationCategory="FinanceApplication"
      />
      <MortgageOverpaymentCalculator />
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <RelatedInsights posts={relatedPosts} />
      </div>
    </>
  )
}
