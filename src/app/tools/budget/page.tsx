import BudgetPlanner from "@/app/components/calculators/BudgetPlanner";
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
    return (
        <BudgetPlanner />
    )
}
