import Link from "next/link";
import BudgetPlanner from "@/app/components/calculators/BudgetPlanner";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Budget Planner | Helpful Money",
  description: "Use our free budget planner to track your income and expenses, visualize your spending with charts, and see how much money you have left over based on the 50/30/20 rule.",
  openGraph: {
    title: "Budget Planner | Helpful Money",
    description: "Use our free budget planner to track your income and expenses, visualize your spending with charts, and see how much money you have left over based on the 50/30/20 rule.",
  },
  alternates: {
    canonical: "/tools/budget/",
  },
};

export default function Budget() {
    const relatedPosts = [
        { title: "What the 50-30-20 Rule Actually Looks Like on a Real Salary", url: "/blog/what-the-50-30-20-rule-looks-like/" },
        { title: "The Forgotten Art of Living Below Your Means", url: "/blog/the-forgotton-art-of-living-below-your-means/" },
        { title: "Your Financial Safety Net", url: "/blog/your-financial-safety-net/" }
    ];

    return (
        <>
            <SoftwareApplicationSchema 
                name="Budget Planner"
                description="Use our free budget planner to track your income and expenses, visualize your spending with charts, and see how much money you have left over based on the 50/30/20 rule."
                url="https://www.helpfulmoney.site/tools/budget/"
                applicationCategory="FinanceApplication"
            />
            <BudgetPlanner />
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <RelatedInsights posts={relatedPosts} />
                <p className="mt-6 text-gray-700">
                    Want a method, not just numbers? <Link href="/guide/give-every-pound-a-job/" className="text-blue-600 underline">Give Every Pound a Job</Link>, a step-by-step budgeting guide (£7).
                </p>
            </div>
        </>
    )
}
