import { Metadata } from "next";
import ThankYouContent from "@/app/components/ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYou() {
  return <ThankYouContent />;
}
