import TermsOfServiceComponent from "@/app/components/TermsOfServiceComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Helpful Money",
  description: "Read the terms and conditions governing the use of Helpful Money's website and services.",
  openGraph: {
    title: "Terms of Service | Helpful Money",
    description: "Read the terms and conditions governing the use of Helpful Money's website and services.",
  },
};

export default function TermsOfService() {
  return <TermsOfServiceComponent />;
}