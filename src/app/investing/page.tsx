import InvestingHub from "@/app/components/InvestingHub";
import { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "Investing Resource Hub | Helpful Money",
  description: "A structured guide to investing: foundations, asset classes, strategy, and mindset. Start your journey to financial freedom with our curated reading path.",
  openGraph: {
    title: "Investing Resource Hub | Helpful Money",
    description: "A structured guide to investing: foundations, asset classes, strategy, and mindset. Start your journey to financial freedom with our curated reading path.",
  },
  alternates: {
    canonical: "/investing/",
  },
};

export default function InvestingPage() {
    const allPosts = getAllBlogPosts("newest", true);
    const serverDate = new Date().toISOString();
    return (
        <InvestingHub allPosts={allPosts} serverDate={serverDate} />
    )
}
