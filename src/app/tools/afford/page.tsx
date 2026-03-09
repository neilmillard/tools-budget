import AffordabilityCalculator from "@/app/components/calculators/AffordabilityCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Affordability Calculator | Helpful Money",
  description: "Calculate how much house you can afford based on your income, deposit, and expenses. See estimated affordable house prices and monthly mortgage payments.",
  openGraph: {
    title: "Mortgage Affordability Calculator | Helpful Money",
    description: "Calculate how much house you can afford based on your income, deposit, and expenses. See estimated affordable house prices and monthly mortgage payments.",
  },
};

export default function Afford() {
    const relatedPosts = [
        { title: "How to Know if You Can Afford a Mortgage Before You Apply", url: "/blog/know-if-you-can-afford-mortgage" }
    ];

    return (
        <>
            <AffordabilityCalculator />
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <RelatedInsights posts={relatedPosts} />
            </div>
        </>
    )
}
