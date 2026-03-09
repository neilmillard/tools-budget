import AboutComponent from "@/app/components/AboutComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The Story Behind Helpful Money",
  description: "Learn about the personal journey behind Helpful Money—from bankruptcy to financial freedom through discipline, ancient wisdom, and modern tools.",
  openGraph: {
    title: "About | The Story Behind Helpful Money",
    description: "Learn about the personal journey behind Helpful Money—from bankruptcy to financial freedom through discipline, ancient wisdom, and modern tools.",
  },
};

export default function About() {
    return <AboutComponent />
}
