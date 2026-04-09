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
        { title: "Investing Resource Hub", url: "/investing" },
        { title: "I Paid Off My Mortgage. Now What?", url: "/blog/paid-off-mortgage-what-next" },
        { title: "Freedom Through Foresight: Strategic Retirement Planning", url: "/blog/freedom-through-foresight" },
        { title: "How to Use a Pension Calculator — and What the Numbers Really Mean", url: "/blog/how-to-use-pension-calculator" },
        { title: "The Seven Cures — Make thy gold multiply", url: "/babylon/series/" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex flex-col items-center mb-12">
                <CircleNum number={4} />
                <h1 className="text-4xl font-bold text-center mt-4">Investing</h1>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 mb-8">
                    <p className="text-purple-900 mb-0">
                        <strong>Just paid off your mortgage?</strong> You've freed up your most significant 
                        monthly expense. Now is the time to redirect that surplus toward your future 
                        self and make your gold truly multiply.
                    </p>
                </div>
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
                    <li>Maximize your pension contributions and take advantage of any employer matching. (If you have a financial advisor, they can help you optimize this for tax efficiency).</li>
                    <li>Research investment platforms (like Hargreaves Lansdown) to manage your ISAs or SIPPs with ease.</li>
                    <li>Research low-cost index funds as a core part of your strategy.</li>
                    <li>Understand the power of tax-efficient wrappers like ISAs or SIPPs.</li>
                    <li>Maintain a long-term perspective and avoid chasing market trends.</li>
                </ul>
            </div>

            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-200 mb-12">
                <h3 className="text-xl font-bold text-emerald-900 mb-4">Investing Resource Hub</h3>
                <p className="text-emerald-800 mb-6">
                    Explore our curated reading path through the fundamental principles of wealth building. 
                    No jargon, just timeless wisdom made actionable.
                </p>
                <Link href="/investing" className="inline-block bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-700 transition-colors">
                    Visit the Hub
                </Link>
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
