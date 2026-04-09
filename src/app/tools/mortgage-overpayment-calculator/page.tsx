import MortgageOverpaymentCalculator from "@/app/components/calculators/MortgageOverpaymentCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Mortgage Overpayment Calculator — See How Much You Could Save | Helpful Money",
  description: "Find out exactly how much interest you could save and how many years you could cut from your mortgage by overpaying each month. Free UK calculator.",
  openGraph: {
    title: "Mortgage Overpayment Calculator — See How Much You Could Save | Helpful Money",
    description: "Find out exactly how much interest you could save and how many years you could cut from your mortgage by overpaying each month. Free UK calculator.",
  },
  alternates: {
    canonical: "/tools/mortgage-overpayment-calculator/",
  },
};

export default function Mortgage() {
  const relatedPosts = [
    { title: "How Much Could You Save by Overpaying Your Mortgage?", url: "/blog/how-much-save-mortgage-overpayment/" },
    { title: "Freedom Through Discipline: Eliminating Consumer Debt", url: "/blog/freedom-through-discipline/" }
  ];

  return (
    <>
      <SoftwareApplicationSchema 
        name="Mortgage Overpayment Calculator"
        description="Find out exactly how much interest you could save and how many years you could cut from your mortgage by overpaying each month. Free UK calculator."
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
