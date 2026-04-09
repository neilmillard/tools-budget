import PensionCalculator from "@/app/components/calculators/PensionCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";
import { Metadata } from "next";
import SoftwareApplicationSchema from "@/components/schema/SoftwareApplicationSchema";

export const metadata: Metadata = {
  title: "Pension Calculator | Helpful Money",
  description: "Estimate your retirement income with our free pension calculator. See how much your pension pot could be worth and how long it might last based on your contributions and withdrawal rate.",
  openGraph: {
    title: "Pension Calculator | Helpful Money",
    description: "Estimate your retirement income with our free pension calculator. See how much your pension pot could be worth and how long it might last based on your contributions and withdrawal rate.",
  },
  alternates: {
    canonical: "/tools/pension/",
  },
};

export default function Pension() {
    const relatedPosts = [
        { title: "How to Use a Pension Calculator — and What the Numbers Really Mean", url: "/blog/how-to-use-pension-calculator/" },
        { title: "Freedom Through Foresight: Strategic Retirement Planning", url: "/blog/freedom-through-foresight/" }
    ];

    return (
        <>
            <SoftwareApplicationSchema 
                name="Pension Calculator"
                description="Estimate your retirement income with our free pension calculator. See how much your pension pot could be worth and how long it might last based on your contributions and withdrawal rate."
                url="https://www.helpfulmoney.site/tools/pension/"
                applicationCategory="FinanceApplication"
            />
            <PensionCalculator/>
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <RelatedInsights posts={relatedPosts} />
            </div>
        </>
    )
};
