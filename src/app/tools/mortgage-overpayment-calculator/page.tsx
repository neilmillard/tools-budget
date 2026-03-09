import MortgageOverpaymentCalculator from "@/app/components/calculators/MortgageOverpaymentCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Overpayment Calculator | Helpful Money",
  description: "Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term.",
  openGraph: {
    title: "Mortgage Overpayment Calculator | Helpful Money",
    description: "Calculate how much time and interest you can save by making overpayments on your mortgage. See the impact of monthly and one-off overpayments on your mortgage term.",
  },
};

export default function Mortgage() {
  const relatedPosts = [
    { title: "Freedom Through Discipline: Eliminating Consumer Debt", url: "/blog/freedom-through-discipline" }
  ];

  return (
    <>
      <MortgageOverpaymentCalculator />
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <RelatedInsights posts={relatedPosts} />
      </div>
    </>
  )
}
