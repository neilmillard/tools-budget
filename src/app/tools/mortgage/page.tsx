import MortgageCalculator from "@/app/components/calculators/MortgageCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Calculator | Helpful Money",
  description: "Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term.",
  openGraph: {
    title: "Mortgage Calculator | Helpful Money",
    description: "Calculate your monthly mortgage payments, total amount paid, and total interest over the term with our free mortgage calculator. Adjust property price, deposit, interest rate, and term.",
  },
};

export default function Mortgage() {
    const relatedPosts = [
        { title: "How to Know if You Can Afford a Mortgage Before You Apply", url: "/blog/know-if-you-can-afford-mortgage" }
    ];

    return (
      <>
          <MortgageCalculator />
          <div className="max-w-4xl mx-auto px-6 pb-12">
              <RelatedInsights posts={relatedPosts} />
          </div>
      </>
    )
}
