import ContactPage from "@/app/components/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Helpful Money",
  description: "Have questions or feedback about our financial tools? Contact the Helpful Money team and we'll get back to you as soon as possible.",
  openGraph: {
    title: "Contact Us | Helpful Money",
    description: "Have questions or feedback about our financial tools? Contact the Helpful Money team and we'll get back to you as soon as possible.",
  },
};

export default function Contact() {
    return <ContactPage siteEmail={"f/mgepvvjk"}/>
}
