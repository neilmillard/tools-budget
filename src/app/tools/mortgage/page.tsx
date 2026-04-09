import MortgageCalculator from "@/app/components/calculators/MortgageCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Helpful Money",
  description: "Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term.",
  openGraph: {
    title: "Mortgage Calculator | Helpful Money",
    description: "Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term.",
  },
  alternates: {
    canonical: "/tools/mortgage/",
  },
};

export default function Mortgage() {
    const relatedPosts = [
        { title: "How to Know if You Can Afford a Mortgage Before You Apply", url: "/blog/know-if-you-can-afford-mortgage/" }
    ];

    return (
      <>
          <SoftwareApplicationSchema 
              name="Mortgage Calculator"
              description="Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term."
              url="https://www.helpfulmoney.site/tools/mortgage/"
              applicationCategory="FinanceApplication"
          />
          <MortgageCalculator />
          <div className="max-w-4xl mx-auto px-6 pb-12">
              <RelatedInsights posts={relatedPosts} />
          </div>
      </>
    )
}
