import React from 'react';
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { CircleNum } from "@/app/components/ui/CircleNum";
import { JourneyNavigation } from "@/app/journey/_components/JourneyNavigation";
import { Metadata } from "next";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Stage 4: Investing | Helpful Money",
    description: "The final stage: long-term wealth building and planning for a comfortable retirement.",
    alternates: {
        canonical: "/journey/investing/",
    },
};

export default function InvestingPage() {
    const relatedPosts = [
        { title: "Freedom Through Foresight: Strategic Retirement Planning", url: "/blog/freedom-through-foresight" },
        { title: "How to Use a Pension Calculator — and What the Numbers Really Mean", url: "/blog/how-to-use-pension-calculator" },
        { title: "The Seven Cures — Make thy gold multiply", url: "/babylon/cure3" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-12">
                <CircleNum number={4} />
                <h1 className="text-4xl font-bold text-center mt-4">Investing</h1>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
                <p>
                    With your home secured and your safety net built, you've reached the final stage of the 
                    financial journey: <strong>long-term wealth building</strong>. 
                    This is where your money begins to work for you.
                </p>
                <p>
                    Investing is the process of using your surplus capital to generate a return over time. 
                    In this stage, the focus is on <strong>compounding</strong>, <strong>diversification</strong>, 
                    and <strong>foresight</strong>.
                </p>
                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 my-8">
                    <h2 className="text-xl font-bold text-emerald-800 mb-4 mt-0">Why This Stage Matters</h2>
                    <p className="text-emerald-900 mb-0">
                        Investing isn't about getting rich quick; it's about <strong>buying back your time</strong>. 
                        By consistently investing for the long term, you're building the foundation for a 
                        retirement where your income isn't tied to your labor.
                    </p>
                </div>
                <h3>Key Strategies for Stage 4:</h3>
                <ul>
                    <li>Maximize your pension contributions and take advantage of any employer matching.</li>
                    <li>Research low-cost index funds as a core part of your strategy.</li>
                    <li>Understand the power of tax-efficient wrappers like ISAs or SIPPs.</li>
                    <li>Maintain a long-term perspective and avoid chasing market trends.</li>
                </ul>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 mb-12">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Helpful Tools</h3>
                <p className="text-blue-800 mb-6">
                    Our Pension Calculator can help you project your future income and see how small changes 
                    today can make a huge difference in your retirement.
                </p>
                <Link href="/tools/pension" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                    Plan Your Retirement
                </Link>
            </div>

            <RelatedInsights posts={relatedPosts} />
            <JourneyNavigation currentStep={4} />
        </div>
    );
}
