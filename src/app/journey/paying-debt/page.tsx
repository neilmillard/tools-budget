import React from 'react';
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { CircleNum } from "@/app/components/ui/CircleNum";
import { JourneyNavigation } from "@/app/journey/_components/JourneyNavigation";
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Stage 1: Paying Debt | Helpful Money",
    description: "The first step on your financial journey: eliminating debt and getting your spending under control.",
    alternates: {
        canonical: "/journey/paying-debt/",
    },
};

export default function PayingDebtPage() {
    const relatedPosts = [
        { title: "Freedom Through Discipline: Eliminating Consumer Debt", url: "/blog/freedom-through-discipline/" },
        { title: "The Forgotten Art of Living Below Your Means", url: "/blog/the-forgotton-art-of-living-below-your-means/" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-12">
                <CircleNum number={1} />
                <h1 className="text-4xl font-bold text-center mt-4">Paying Debt</h1>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
                <p>
                    The first stage of the financial journey is often the most challenging but also the most rewarding. 
                    It begins when you realize that you might be spending more than your income, or you've accumulated 
                    debts that are holding you back from your goals.
                </p>
                <p>
                    In this stage, the focus is on <strong>discipline</strong> and <strong>awareness</strong>. 
                    You are identifying where your money goes, cutting unnecessary expenses, and systematically 
                    paying off credit cards, personal loans, or other high-interest consumer debt.
                </p>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 my-8">
                    <h2 className="text-xl font-bold text-orange-800 mb-4 mt-0">Why This Stage Matters</h2>
                    <p className="text-orange-900 mb-0">
                        Debt is like a weight dragging behind you. By eliminating it, you're not just saving on interest; 
                        you're reclaiming your future income and giving yourself the mental space to think about more 
                        than just next month's bills.
                    </p>
                </div>
                <h3>Key Actions for Stage 1:</h3>
                <ul>
                    <li>Track every penny of your spending for a month.</li>
                    <li>Create a "survival budget" that covers only your essentials.</li>
                    <li>List all debts from smallest to largest and start the "debt snowball".</li>
                    <li>Stop using credit cards for new purchases.</li>
                </ul>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 mb-12">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Helpful Tools</h3>
                <p className="text-blue-800 mb-6">
                    Our Budget Planner can help you see exactly where your money is going and identify areas where you can save to pay down debt faster.
                </p>
                <Link href="/tools/budget/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                    Try the Budget Planner
                </Link>
            </div>

            <RelatedInsights posts={relatedPosts} />
            <JourneyNavigation currentStep={1} />
        </div>
    );
}
