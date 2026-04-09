import React from 'react';
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { CircleNum } from "@/app/components/ui/CircleNum";
import { JourneyNavigation } from "@/app/journey/_components/JourneyNavigation";
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Stage 3: Buying a Home | Helpful Money",
    description: "The third stage: navigating mortgage affordability and overpayment strategies.",
    alternates: {
        canonical: "/journey/buying-a-home/",
    },
};

export default function BuyingAHomePage() {
    const relatedPosts = [
        { title: "How to Know if You Can Afford a Mortgage Before You Apply", url: "/blog/know-if-you-can-afford-mortgage" },
        { title: "How Much Could You Save by Overpaying Your Mortgage?", url: "/blog/how-much-save-mortgage-overpayment" },
        { title: "The Seven Cures — Make of thy dwelling a profitable investment", url: "/babylon/series/" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-12">
                <CircleNum number={3} />
                <h1 className="text-4xl font-bold text-center mt-4">Buying a Home</h1>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
                <p>
                    For many, the dream of home ownership is one of the most significant financial milestones. 
                    In this stage, you've saved your deposit and are now
                    navigating <strong>affordability</strong> and <strong>mortgage management</strong>.
                </p>
                <p>
                    This is where long-term planning meets your biggest monthly expense. 
                    Knowing exactly what you can afford, and how to pay it off faster, 
                    can save you tens of thousands of pounds in interest over your lifetime.
                </p>
                <div className="bg-green-50 p-6 rounded-xl border border-green-200 my-8">
                    <h2 className="text-xl font-bold text-green-800 mb-4 mt-0">Why This Stage Matters</h2>
                    <p className="text-green-900 mb-0">
                        A home is more than just a place to live; it's often your most significant <strong>asset</strong>. 
                        By understanding the math behind your mortgage, you can move from just "paying rent to the bank" 
                        to building real equity and financial stability.
                    </p>
                </div>
                <h3>Key Milestones for Stage 3:</h3>
                <ul>
                    <li>Understand your true affordability based on your actual budget, not just bank multiples.</li>
                    <li>Research mortgage types and find the one that fits your long-term plan.</li>
                    <li>Look into overpayment strategies to shorten your mortgage term.</li>
                    <li>Keep your emergency fund intact even after paying your deposit.</li>
                </ul>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 mb-12">
                <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Affordability</h3>
                    <p className="text-blue-800 mb-6">
                        See what a bank might lend you and how much your monthly payments could be.
                    </p>
                    <Link href="/tools/afford" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                        Check Affordability
                    </Link>
                </div>
                <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
                    <h3 className="text-xl font-bold text-green-900 mb-4">Overpayments</h3>
                    <p className="text-green-800 mb-6">
                        Calculate how much interest you could save by paying just a little more each month.
                    </p>
                    <Link href="/tools/mortgage-overpayment-calculator" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">
                        Calculate Savings
                    </Link>
                </div>
            </div>

            <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200 mb-12 text-center">
                <h3 className="text-2xl font-bold text-purple-900 mb-4">Just Paid Off Your Mortgage?</h3>
                <p className="text-purple-800 mb-6 max-w-2xl mx-auto">
                    Congratulations! You've reached a massive milestone. But what comes next? 
                    Learn how to bridge the gap from home ownership to long-term wealth building.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/blog/paid-off-mortgage-what-next" className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">
                        Now What? Guide
                    </Link>
                    <Link href="/journey/investing" className="inline-block bg-white text-purple-600 border-2 border-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-purple-50 transition-colors">
                        Go to Stage 4: Investing
                    </Link>
                </div>
            </div>

            <RelatedInsights posts={relatedPosts} />
            <JourneyNavigation currentStep={3} />
        </div>
    );
}
