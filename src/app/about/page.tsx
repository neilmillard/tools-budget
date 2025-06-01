import AboutComponent from "@/app/components/AboutComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Helpful Money",
  description: "Learn about Helpful Money - a site showcasing development skills while providing useful financial tools to help you manage your money and family finances.",
  openGraph: {
    title: "About Us | Helpful Money",
    description: "Learn about Helpful Money - a site showcasing development skills while providing useful financial tools to help you manage your money and family finances.",
  },
};

export default function About() {
    return <AboutComponent />
}
