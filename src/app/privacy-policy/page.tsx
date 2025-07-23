import PrivacyPolicyComponent from "@/app/components/PrivacyPolicyComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Helpful Money",
  description: "Learn about how Helpful Money collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy | Helpful Money",
    description: "Learn about how Helpful Money collects, uses, and protects your personal information.",
  },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyComponent />;
}