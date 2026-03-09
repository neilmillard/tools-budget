import React from 'react';
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { CircleNum } from "@/app/components/ui/CircleNum";
import { JourneyNavigation } from "@/app/journey/_components/JourneyNavigation";
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Stage 2: Saving | Helpful Money",
    description: "The second stage: building your financial cushion and working towards a house deposit.",
};

export default function SavingPage() {
    const relatedPosts = [
        { title: "Your Financial Safety Net", url: "/blog/your-financial-safety-net" },
        { title: "The Seven Cures — Start thy purse to fattening", url: "/babylon/cure1" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-12">
                <CircleNum number={2} />
                <h1 className="text-4xl font-bold text-center mt-4">Saving</h1>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
                <p>
                    Once your high-interest debts are gone, the focus shifts to <strong>accumulation</strong>. 
                    In this stage, your expenses are lower than your income, and you are consistently saving 
                    money every month.
                </p>
                <p>
                    This stage is where your <strong>Financial Safety Net</strong> is built — a cushion that 
                    protects you from life's unexpected turns and gives you the confidence to make choices 
                    without financial fear.
                </p>
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 my-8">
                    <h2 className="text-xl font-bold text-yellow-800 mb-4 mt-0">Why This Stage Matters</h2>
                    <p className="text-yellow-900 mb-0">
                        Savings buy you <strong>freedom</strong>. Whether it's the freedom to leave a job you dislike, 
                        handle a medical emergency without stress, or save for your first home deposit, 
                        this is where your future wealth begins to take root.
                    </p>
                </div>
                <h3>Key Objectives for Stage 2:</h3>
                <ul>
                    <li>Build an emergency fund covering 3-6 months of essential expenses.</li>
                    <li>Automate your savings so they happen before you have a chance to spend the money.</li>
                    <li>Research the best high-yield savings accounts or ISAs for your needs.</li>
                    <li>Begin saving for a specific goal, like a house deposit or life milestone.</li>
                </ul>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 mb-12">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Helpful Tools</h3>
                <p className="text-blue-800 mb-6">
                    Our Budget Planner's 50/30/20 view helps you ensure that 20% of your income is consistently 
                    moving towards your savings goals.
                </p>
                <Link href="/tools/budget" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                    Plan Your Savings
                </Link>
            </div>

            <RelatedInsights posts={relatedPosts} />
            <JourneyNavigation currentStep={2} />
        </div>
    );
}
