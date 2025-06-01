import BenGrahamInvesting from "@/app/components/BenGrahamInvesting";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ben Graham Investing Principles | Helpful Money",
  description: "Explore Ben Graham's investing principles inspired by 'The Intelligent Investor'. Learn timeless wisdom for successful value investing and building wealth.",
  openGraph: {
    title: "Ben Graham Investing Principles | Helpful Money",
    description: "Explore Ben Graham's investing principles inspired by 'The Intelligent Investor'. Learn timeless wisdom for successful value investing and building wealth.",
  },
};

export default function InvestingPage() {
    return (
        <BenGrahamInvesting />
    )
}
