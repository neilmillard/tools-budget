import RichestManInBabylon from "@/app/components/RichestManInBabylon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Seven Cures | The Babylon Series | Helpful Money",
  description: "Explore the Seven Cures for a Lean Purse from 'The Richest Man in Babylon'. Timeless financial lessons paired with modern tools.",
  openGraph: {
    title: "The Seven Cures | The Babylon Series | Helpful Money",
    description: "Explore the Seven Cures for a Lean Purse from 'The Richest Man in Babylon'. Timeless financial lessons paired with modern tools.",
  },
  alternates: {
    canonical: "/babylon/series/",
  },
};

export default function Babylon() {
    return (
        <RichestManInBabylon/>
    )
}
