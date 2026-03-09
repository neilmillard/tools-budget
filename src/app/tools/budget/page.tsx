import BudgetPlanner from "@/app/components/calculators/BudgetPlanner";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Planner | Helpful Money",
  description: "Use our free budget planner to track your income and expenses, visualize your spending with charts, and see how much money you have left over based on the 50/30/20 rule.",
  openGraph: {
    title: "Budget Planner | Helpful Money",
    description: "Use our free budget planner to track your income and expenses, visualize your spending with charts, and see how much money you have left over based on the 50/30/20 rule.",
  },
};

export default function Budget() {
    const relatedPosts = [
        { title: "The Forgotten Art of Living Below Your Means", url: "/blog/the-forgotton-art-of-living-below-your-means" },
        { title: "Your Financial Safety Net", url: "/blog/your-financial-safety-net" }
    ];

    return (
        <>
            <BudgetPlanner />
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <RelatedInsights posts={relatedPosts} />
            </div>
        </>
    )
}
