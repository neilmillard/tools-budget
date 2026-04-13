import AffordabilityCalculator from "@/app/components/calculators/AffordabilityCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator: How Much Can I Afford? | Helpful Money",
  description: "Find out exactly how much mortgage you can afford. Our UK affordability calculator helps you calculate an affordable house price based on your income, deposit, and expenses.",
  openGraph: {
    title: "Mortgage Affordability Calculator: How Much Can I Afford? | Helpful Money",
    description: "Find out exactly how much mortgage you can afford. Our UK affordability calculator helps you calculate an affordable house price based on your income, deposit, and expenses.",
  },
  alternates: {
    canonical: "/tools/afford/",
  },
};

export default function Afford() {
    const relatedPosts = [
        { title: "How to Know if You Can Afford a Mortgage Before You Apply", url: "/blog/know-if-you-can-afford-mortgage/" },
        { title: "I Paid Off My Mortgage. Now What?", url: "/blog/paid-off-mortgage-what-next/" }
    ];

    return (
        <>
            <SoftwareApplicationSchema 
                name="Mortgage Affordability Calculator"
                description="Find out exactly how much mortgage you can afford. Our UK affordability calculator helps you calculate an affordable house price based on your income, deposit, and expenses."
                url="https://www.helpfulmoney.site/tools/afford/"
                applicationCategory="FinanceApplication"
            />
            <AffordabilityCalculator />
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <RelatedInsights posts={relatedPosts} />
            </div>
        </>
    )
}
