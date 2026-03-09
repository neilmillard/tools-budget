import PensionCalculator from "@/app/components/calculators/PensionCalculator";
import RelatedInsights from "@/app/components/calculators/RelatedInsights";

export default function Pension() {
    const relatedPosts = [
        { title: "Freedom Through Foresight: Strategic Retirement Planning", url: "/blog/freedom-through-foresight" }
    ];

    return (
        <>
            <PensionCalculator/>
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <RelatedInsights posts={relatedPosts} />
            </div>
        </>
    )
};
