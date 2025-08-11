import DcfAnalysis from "@/app/components/DcfAnalysis";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discounted Cash Flow Analysis | Helpful Money",
  description: "Learn how to value stocks using Discounted Cash Flow (DCF) analysis. Understand the fundamentals of calculating a company's intrinsic value through future cash flow projections.",
  openGraph: {
    title: "Discounted Cash Flow Analysis | Helpful Money",
    description: "Learn how to value stocks using Discounted Cash Flow (DCF) analysis. Understand the fundamentals of calculating a company's intrinsic value through future cash flow projections.",
  },
};

export default function DcfPage() {
  return (
    <DcfAnalysis />
  )
}