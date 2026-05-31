import InvestmentCalculator from "@/app/components/calculators/InvestmentCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Investment Calculator | Helpful Money",
  description: "Estimate your investment returns with our free investment calculator. See how much your investment pot could be worth based on your contributions and return rate.",
  openGraph: {
    title: "Investment Calculator | Helpful Money",
    description: "Estimate your investment returns with our free investment calculator. See how much your investment pot could be worth based on your contributions and return rate.",
  },
  alternates: {
    canonical: "/tools/investment-calculator/",
  },
};

export default function Investment() {
  const relatedPosts = [
    { title: "Keeping What You Earn: Principles of Tax-Efficient Investing", url: "/blog/keeping-what-you-earn/" }
  ];

  return (
    <>
      <SoftwareApplicationSchema
        name="Investment Calculator"
        description="Estimate your investment returns with our free investment calculator. See how much your investment pot could be worth based on your contributions and return rate."
        url="https://www.helpfulmoney.site/tools/investment-calculator/"
        applicationCategory="FinanceApplication"
      />
      <div className="max-w-4xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Investment Calculator</h1>
        <p className="text-lg text-gray-600 mb-8">
          Plan your wealth-building journey with our comprehensive investment tool.
        </p>
      </div>
      <InvestmentCalculator/>
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <RelatedInsights posts={relatedPosts} />
      </div>
    </>
  )
};
