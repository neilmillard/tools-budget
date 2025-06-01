import RichestManInBabylon from "@/app/components/RichestManInBabylon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Richest Man in Babylon | Helpful Money",
  description: "Explore the timeless financial wisdom from 'The Richest Man in Babylon' book. Learn the Seven Cures for a lean purse and principles for building wealth.",
  openGraph: {
    title: "The Richest Man in Babylon | Helpful Money",
    description: "Explore the timeless financial wisdom from 'The Richest Man in Babylon' book. Learn the Seven Cures for a lean purse and principles for building wealth.",
  },
};

export default function Babylon() {
    return (
        <RichestManInBabylon/>
    )
}
