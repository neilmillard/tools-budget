import AffordabilityCalculator from "@/app/components/calculators/AffordabilityCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "What Mortgage Can I Afford? UK Calculator | Helpful Money",
  description: "Find out how much mortgage you can afford based on your income, deposit and expenses. Free UK affordability calculator — see your borrowing limit in seconds.",
  openGraph: {
    title: "What Mortgage Can I Afford? UK Calculator | Helpful Money",
    description: "Find out how much mortgage you can afford based on your income, deposit and expenses. Free UK affordability calculator — see your borrowing limit in seconds.",
  },
  alternates: {
    canonical: "/tools/afford/",
  },
};

export default function Afford() {
    const relatedPosts = [
        { title: "How to Know if You Can Afford a Mortgage Before You Apply", url: "/blog/know-if-you-can-afford-mortgage/" }
    ];

    return (
        <>
            <SoftwareApplicationSchema 
                name="Mortgage Affordability Calculator"
                description="Find out how much mortgage you can afford based on your income, deposit and expenses. Free UK affordability calculator — see your borrowing limit in seconds."
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
